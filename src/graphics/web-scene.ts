import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module'
import {
  GodRaysCombineShader,
  GodRaysDepthMaskShader,
  GodRaysFakeSunShader,
  GodRaysGenerateShader,
} from 'three/addons/shaders/GodRaysShader'
import { calculateLinearlyWeightedAverage, forceArray } from '~/lib/utils'
import { buildCaches } from './caches'
import { type FontWeight, getFontMetrics, loadFontShapes } from './fonts'
import { EPSILON, EXTRUDE_DEPTH, svgPathToShapePath } from './graphics-helpers'
import type { SceneObject } from './scene-object'
import { SvgObject } from './svg-object'
import { TextObject } from './text-object'
import { RectangularObject } from './rectangular-object'
import { randomFloat } from '~/lib/random'

interface GodraysUniforms {
  [key: string]: THREE.IUniform
}

interface PostprocessingState {
  enabled: boolean
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
  rtTextureColors: THREE.WebGLRenderTarget
  rtTextureDepth: THREE.WebGLRenderTarget
  rtTextureDepthMask: THREE.WebGLRenderTarget
  rtTextureGodRays1: THREE.WebGLRenderTarget
  rtTextureGodRays2: THREE.WebGLRenderTarget
  godrayMaskUniforms: GodraysUniforms
  materialGodraysDepthMask: THREE.ShaderMaterial
  godrayGenUniforms: GodraysUniforms
  materialGodraysGenerate: THREE.ShaderMaterial
  godrayCombineUniforms: GodraysUniforms
  materialGodraysCombine: THREE.ShaderMaterial
  godraysFakeSunUniforms: GodraysUniforms
  materialGodraysFakeSun: THREE.ShaderMaterial
  quad: THREE.Mesh
}

const BG_COLOR = 0x004d40
const SUN_COLOR = 0xe0f2f1
const GODRAY_RENDER_TARGET_RES_MULTIPLIER = 0.5
const HEX_GRID_RATIO = 2
const HIDE_PROJECTED_OBJECTS = !import.meta.env.DEV
const HEX_GRID_ENTRY_DURATION = 3500

//TODO: particles being emitted from extruded objects

export class WebScene {
  private readonly renderer: THREE.WebGLRenderer
  /** Rendered before main scene which uses postprocessing */
  private readonly backgroundScene: THREE.Scene
  private readonly scene: THREE.Scene
  private readonly camera: THREE.PerspectiveCamera
  private readonly postprocessing: PostprocessingState

  private readonly sunPosition = new THREE.Vector3(0, 618, -1000)

  private readonly clipPosition = new THREE.Vector4()
  private readonly screenSpacePosition = new THREE.Vector3()

  private readonly materialDepth = new THREE.MeshDepthMaterial()
  private stats: Stats | null = null
  private visibleObjectsPanel: Stats.Panel | null = null

  private readonly objects: Array<SceneObject> = []
  private readonly backgroundGrid = {
    hexagons: [] as Array<THREE.Mesh>,
    initialZPositions: [] as Array<number>,
    initializingPhase: false,
    initTimeStart: 0,
    initTimeEnd: 0,
  }
  private readonly caches = buildCaches()

  private readonly windowResizeCallback = this.onWindowResize.bind(this)

  private lastTime = 0
  private maxVisibleObjectsCount = 0

  private performanceMeasurements = new Array<number>(100).fill(0)
  private lowPerformanceMode = false

  private transparentMaterial = new THREE.MeshBasicMaterial({
    fog: false,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    opacity: 0,
  })
  private hexGridMaterial = new THREE.MeshStandardMaterial({
    color: BG_COLOR,
    // color: '#fffff',
    metalness: 0.8,
    roughness: 0.8,
    // transparent: true,
    // opacity: 0.8,

    // premultipliedAlpha: true,
    // blending: THREE.MultiplyBlending,
    blending: THREE.CustomBlending,
    blendSrc: THREE.SrcAlphaFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    blendEquation: THREE.MaxEquation,
  })

  constructor(private readonly container: HTMLDivElement) {
    const width = window.innerWidth
    const height = window.innerHeight

    this.clipPosition = new THREE.Vector4()
    this.screenSpacePosition = new THREE.Vector3()

    this.camera = new THREE.PerspectiveCamera(70, width / height, 10, 1000)
    this.camera.position.z = 200

    this.scene = new THREE.Scene()
    this.backgroundScene = new THREE.Scene()
    this.materialDepth = new THREE.MeshDepthMaterial()

    // const ambientLight = new THREE.AmbientLight(0xffffff, 5)
    // this.scene.add(ambientLight)
    // const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    // dirLight.position.set(0, 20, 100)
    // dirLight.lookAt(0, 0, 0)
    // // const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10)
    // // this.scene.add(dirLightHelper)
    // this.scene.add(dirLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 7)
    dirLight.position.set(0, 0, 40)
    dirLight.lookAt(0, 0, 0)
    this.backgroundScene.add(dirLight)

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      // depth: false,
      powerPreference: 'low-power',
      alpha: false,
      premultipliedAlpha: false,
    })
    this.renderer.setClearColor(0xb2dfdb)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(width, height)
    container.appendChild(this.renderer.domElement)
    this.renderer.autoClear = false

    // const controls = new OrbitControls(this.camera, this.renderer.domElement)
    // controls.minDistance = 50
    // controls.maxDistance = 500

    if (import.meta.env.DEV) {
      this.stats = new Stats()
      this.visibleObjectsPanel = new Stats.Panel('visible', '#ff00ff', '#000000')
      this.stats.addPanel(this.visibleObjectsPanel)

      this.stats.dom.style.top = 'auto'
      this.stats.dom.style.bottom = '0px'
      container.appendChild(this.stats.dom)
    }

    this.postprocessing = this.initPostprocessing(width, height)

    const animate: XRFrameRequestCallback = (time) => {
      this.stats?.begin()
      this.render(time)
      this.stats?.end()
    }

    this.renderer.setAnimationLoop(animate)

    window.addEventListener('resize', this.windowResizeCallback)
  }

  dispose() {
    window.removeEventListener('resize', this.windowResizeCallback)
    this.renderer.setAnimationLoop(null)
    this.container.removeChild(this.renderer.domElement)
    if (this.stats) {
      this.container.removeChild(this.stats.dom)
    }

    // Proper disposal
    this.materialDepth.dispose()

    this.objects.forEach((object) => {
      object.dispose()
    })
    this.objects.length = 0

    this.backgroundGrid.hexagons.forEach((hexagon) => {
      hexagon.geometry.dispose()
    })
    this.backgroundGrid.hexagons.length = 0
    this.backgroundGrid.initialZPositions.length = 0

    this.caches.dispose()
    this.transparentMaterial.dispose()
    this.hexGridMaterial.dispose()

    this.backgroundScene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        object.material.dispose()
      }
    })
    this.backgroundScene.clear()

    this.postprocessing.rtTextureColors.dispose()
    this.postprocessing.rtTextureDepth.dispose()
    this.postprocessing.rtTextureDepthMask.dispose()
    this.postprocessing.rtTextureGodRays1.dispose()
    this.postprocessing.rtTextureGodRays2.dispose()

    this.postprocessing.materialGodraysDepthMask.dispose()
    this.postprocessing.materialGodraysGenerate.dispose()
    this.postprocessing.materialGodraysCombine.dispose()
    this.postprocessing.materialGodraysFakeSun.dispose()

    this.postprocessing.quad.geometry.dispose()
    this.renderer.dispose()
  }

  private onWindowResize() {
    const w = window.innerWidth
    const h = window.innerHeight

    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)

    this.postprocessing.rtTextureColors.setSize(w, h)
    this.postprocessing.rtTextureDepth.setSize(w, h)
    this.postprocessing.rtTextureDepthMask.setSize(w, h)

    const aw = w * GODRAY_RENDER_TARGET_RES_MULTIPLIER
    const ah = h * GODRAY_RENDER_TARGET_RES_MULTIPLIER
    this.postprocessing.rtTextureGodRays1.setSize(aw, ah)
    this.postprocessing.rtTextureGodRays2.setSize(aw, ah)
  }

  public onPointerMove(x: number, y: number) {
    if (this.backgroundGrid.initializingPhase) {
      return
    }

    const normalizedX = (x / window.innerWidth) * 2 - 1
    const normalizedY = -(y / window.innerHeight) * 2 + 1

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const raycaster = new THREE.Raycaster()

    const point = new THREE.Vector3()
    raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), this.camera)
    raycaster.ray.intersectPlane(plane, point)

    const distanceCutoff = 60

    for (const hexagon of this.backgroundGrid.hexagons) {
      const dX = point.x - hexagon.position.x
      const dY = point.y - hexagon.position.y

      if (Math.abs(dX) > distanceCutoff || Math.abs(dY) > distanceCutoff) {
        hexagon.position.setZ(0)
        continue
      }

      const dst = Math.sqrt(dX ** 2 + dY ** 2)
      const zFactor = Math.pow(1 - Math.min(1, dst / distanceCutoff), 3)
      hexagon.position.setZ(-zFactor * 8)
    }
  }

  private initPostprocessing(w: number, h: number) {
    const scene = new THREE.Scene()

    const adjustedWidth = w * GODRAY_RENDER_TARGET_RES_MULTIPLIER
    const adjustedHeight = h * GODRAY_RENDER_TARGET_RES_MULTIPLIER

    const godrayMaskUniforms = THREE.UniformsUtils.clone(GodRaysDepthMaskShader.uniforms)
    const godrayGenUniforms = THREE.UniformsUtils.clone(GodRaysGenerateShader.uniforms)
    const godrayCombineUniforms = THREE.UniformsUtils.clone(GodRaysCombineShader.uniforms)
    const godraysFakeSunUniforms = THREE.UniformsUtils.clone(GodRaysFakeSunShader.uniforms)

    godraysFakeSunUniforms.bgColor.value.setHex(BG_COLOR)
    godraysFakeSunUniforms.sunColor.value.setHex(SUN_COLOR)
    godrayCombineUniforms.fGodRayIntensity.value = 0.4

    const materialGodraysGenerate = new THREE.ShaderMaterial({
      uniforms: godrayGenUniforms,
      vertexShader: GodRaysGenerateShader.vertexShader,
      fragmentShader: GodRaysGenerateShader.fragmentShader,
    })

    const postprocessing: PostprocessingState = {
      enabled: true,
      scene,
      camera: new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 1, 10000),

      rtTextureColors: new THREE.WebGLRenderTarget(w, h, {
        type: THREE.HalfFloatType,
      }),
      rtTextureDepth: new THREE.WebGLRenderTarget(w, h, {
        type: THREE.HalfFloatType,
      }),
      rtTextureDepthMask: new THREE.WebGLRenderTarget(w, h, {
        type: THREE.HalfFloatType,
      }),

      rtTextureGodRays1: new THREE.WebGLRenderTarget(adjustedWidth, adjustedHeight, {
        type: THREE.HalfFloatType,
      }),
      rtTextureGodRays2: new THREE.WebGLRenderTarget(adjustedWidth, adjustedHeight, {
        type: THREE.HalfFloatType,
      }),

      godrayMaskUniforms,
      materialGodraysDepthMask: new THREE.ShaderMaterial({
        uniforms: godrayMaskUniforms,
        vertexShader: GodRaysDepthMaskShader.vertexShader,
        fragmentShader: GodRaysDepthMaskShader.fragmentShader,
      }),

      godrayGenUniforms,
      materialGodraysGenerate,

      godrayCombineUniforms,
      materialGodraysCombine: new THREE.ShaderMaterial({
        uniforms: godrayCombineUniforms,
        vertexShader: GodRaysCombineShader.vertexShader,
        fragmentShader: GodRaysCombineShader.fragmentShader,
      }),

      godraysFakeSunUniforms,
      materialGodraysFakeSun: new THREE.ShaderMaterial({
        uniforms: godraysFakeSunUniforms,
        vertexShader: GodRaysFakeSunShader.vertexShader,
        fragmentShader: GodRaysFakeSunShader.fragmentShader,
      }),

      quad: new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), materialGodraysGenerate),
    }

    postprocessing.camera.position.z = 100
    scene.add(postprocessing.camera)

    postprocessing.quad.position.z = -9900
    scene.add(postprocessing.quad)

    return postprocessing
  }

  private filterGodRays(
    inputTex: THREE.Texture,
    renderTarget: THREE.WebGLRenderTarget,
    stepSize: number,
  ) {
    this.postprocessing.scene.overrideMaterial = this.postprocessing.materialGodraysGenerate
    this.postprocessing.godrayGenUniforms.fStepSize.value = stepSize
    this.postprocessing.godrayGenUniforms.tInput.value = inputTex

    this.renderer.setRenderTarget(renderTarget)
    this.renderer.render(this.postprocessing.scene, this.postprocessing.camera)
    this.postprocessing.scene.overrideMaterial = null
  }

  private render(time: DOMHighResTimeStamp) {
    const deltaTime = time - this.lastTime
    this.lastTime = time

    const start = performance.now()

    if (this.backgroundGrid.initializingPhase) {
      const progress =
        (start - this.backgroundGrid.initTimeStart) /
        (this.backgroundGrid.initTimeEnd - this.backgroundGrid.initTimeStart)

      if (progress >= 1) {
        this.backgroundGrid.initializingPhase = false
        for (let i = 0; i < this.backgroundGrid.hexagons.length; i++) {
          this.backgroundGrid.hexagons[i].position.z = 0
        }
      } else {
        for (let i = 0; i < this.backgroundGrid.hexagons.length; i++) {
          this.backgroundGrid.hexagons[i].position.z =
            this.backgroundGrid.initialZPositions[i] * Math.sin(Math.pow(progress, 2) * Math.PI)
        }
      }
    }

    let visibleObjectsCount = 0
    for (const sceneObject of this.objects) {
      if (sceneObject.disposed) {
        this.objects.splice(this.objects.indexOf(sceneObject), 1)
        continue
      }

      sceneObject.update(Math.min(1000, deltaTime), this.lowPerformanceMode)
      if (sceneObject.isVisible()) {
        visibleObjectsCount++
      }
    }
    this.maxVisibleObjectsCount = Math.max(this.maxVisibleObjectsCount, visibleObjectsCount)
    this.visibleObjectsPanel?.update(visibleObjectsCount, this.maxVisibleObjectsCount)

    if (this.postprocessing.enabled) {
      this.clipPosition.set(this.sunPosition.x, this.sunPosition.y, this.sunPosition.z, 1)
      this.clipPosition
        .applyMatrix4(this.camera.matrixWorldInverse)
        .applyMatrix4(this.camera.projectionMatrix)

      this.clipPosition.x /= this.clipPosition.w
      this.clipPosition.y /= this.clipPosition.w

      this.screenSpacePosition.x = (this.clipPosition.x + 1) / 2
      this.screenSpacePosition.y = (this.clipPosition.y + 1) / 2
      this.screenSpacePosition.z = this.clipPosition.z

      this.postprocessing.godrayGenUniforms.vSunPositionScreenSpace.value.copy(
        this.screenSpacePosition,
      )
      this.postprocessing.godraysFakeSunUniforms.vSunPositionScreenSpace.value.copy(
        this.screenSpacePosition,
      )

      this.renderer.setRenderTarget(this.postprocessing.rtTextureColors)
      this.renderer.clear(true, true, false)

      const sunSQH = 0.74 * window.innerHeight
      const sunSQW = 0.74 * window.innerHeight
      const sunX = this.screenSpacePosition.x * window.innerWidth
      const sunY = this.screenSpacePosition.y * window.innerHeight

      this.renderer.setScissor(sunX - sunSQW / 2, sunY - sunSQH / 2, sunSQW, sunSQH)
      this.renderer.setScissorTest(true)

      this.postprocessing.godraysFakeSunUniforms.fAspect.value =
        window.innerWidth / window.innerHeight
      this.postprocessing.scene.overrideMaterial = this.postprocessing.materialGodraysFakeSun
      this.renderer.setRenderTarget(this.postprocessing.rtTextureColors)
      this.renderer.render(this.postprocessing.scene, this.postprocessing.camera)
      this.renderer.setScissorTest(false)

      this.backgroundScene.overrideMaterial = this.hexGridMaterial
      this.renderer.render(this.backgroundScene, this.camera)

      if (!HIDE_PROJECTED_OBJECTS) {
        this.scene.overrideMaterial = null
        this.renderer.setRenderTarget(this.postprocessing.rtTextureColors)
        this.renderer.render(this.scene, this.camera)
      }

      this.scene.overrideMaterial = this.materialDepth
      this.renderer.setRenderTarget(this.postprocessing.rtTextureDepth)
      this.renderer.clear()
      this.renderer.render(this.scene, this.camera)

      this.postprocessing.godrayMaskUniforms.tInput.value =
        this.postprocessing.rtTextureDepth.texture
      this.postprocessing.scene.overrideMaterial = this.postprocessing.materialGodraysDepthMask
      this.renderer.setRenderTarget(this.postprocessing.rtTextureDepthMask)
      this.renderer.render(this.postprocessing.scene, this.postprocessing.camera)

      const filterLen = 0.5
      const TAPS_PER_PASS = 5.0

      this.filterGodRays(
        this.postprocessing.rtTextureDepthMask.texture,
        this.postprocessing.rtTextureGodRays2,
        getStepSize(filterLen, TAPS_PER_PASS, 1.0),
      )
      this.filterGodRays(
        this.postprocessing.rtTextureGodRays2.texture,
        this.postprocessing.rtTextureGodRays1,
        getStepSize(filterLen, TAPS_PER_PASS, 2.0),
      )
      this.filterGodRays(
        this.postprocessing.rtTextureGodRays1.texture,
        this.postprocessing.rtTextureGodRays2,
        getStepSize(filterLen, TAPS_PER_PASS, 3.0),
      )

      this.postprocessing.godrayCombineUniforms.tColors.value =
        this.postprocessing.rtTextureColors.texture
      this.postprocessing.godrayCombineUniforms.tGodRays.value =
        this.postprocessing.rtTextureGodRays2.texture

      this.postprocessing.scene.overrideMaterial = this.postprocessing.materialGodraysCombine
      this.renderer.setRenderTarget(null)
      this.renderer.render(this.postprocessing.scene, this.postprocessing.camera)
      this.postprocessing.scene.overrideMaterial = null

      // Final pass: render objects on top of everything without additive blending
      if (!HIDE_PROJECTED_OBJECTS && this.objects.length > 0) {
        this.renderer.autoClear = false
        this.scene.overrideMaterial = null
        this.renderer.render(this.scene, this.camera)
      }
    } else {
      this.renderer.setRenderTarget(null)
      this.renderer.clear()

      this.renderer.render(this.backgroundScene, this.camera)
      if (!HIDE_PROJECTED_OBJECTS) {
        this.renderer.render(this.scene, this.camera)
      }
    }

    if (!this.lowPerformanceMode) {
      const elapsed = performance.now() - start
      this.performanceMeasurements.shift()
      this.performanceMeasurements.push(elapsed)
      const overallPerformance = calculateLinearlyWeightedAverage(this.performanceMeasurements)

      // If rendering takes more than 16ms on average
      if (overallPerformance > 16) {
        console.warn(
          'Overall performance is too high:',
          `${overallPerformance.toFixed(2)}ms average render time`,
          '\nSwitching to low performance mode',
        )
        this.lowPerformanceMode = true
      }
    }
  }

  public getCamera() {
    return this.camera
  }

  public setBackgroundColor(color: number) {
    this.postprocessing.godraysFakeSunUniforms.bgColor.value.setHex(color)
    this.hexGridMaterial.color.setHex(color)
  }
  public setSunColor(color: number) {
    this.postprocessing.godraysFakeSunUniforms.sunColor.value.setHex(color)
  }

  public setSunPosition(factor: number) {
    this.sunPosition.y = 618 - factor * 1236
  }

  private shapesToGeometry(shapes: THREE.Shape[]) {
    const geometry = new THREE.ExtrudeGeometry(shapes, {
      depth: EXTRUDE_DEPTH,
      steps: 1,
      bevelEnabled: false,
      // bevelThickness: 2,
      // bevelSize: 0.5,
      // bevelOffset: 0,
      // bevelSegments: 4,
    })
    geometry.computeVertexNormals()
    geometry.normalizeNormals()
    return geometry
  }

  private composeMesh(geometry: THREE.ExtrudeGeometry, ...materials: THREE.Material[]) {
    return new THREE.Mesh(geometry, materials)
  }

  public async createTextObject(
    text: string,
    size: number,
    _color: string,
    _frontColor: string,
    weight: FontWeight,
  ) {
    return loadFontShapes(text, size, weight).then((shapes) => {
      const geometry = this.shapesToGeometry(shapes)

      const textMesh = this.composeMesh(
        geometry,
        //TODO
        // this.caches.getBasicMaterial(_frontColor),
        // this.caches.getBasicMaterial(_color),
        this.transparentMaterial,
        this.transparentMaterial,
      )
      textMesh.rotateX(Math.PI)

      geometry.computeBoundingBox()

      this.scene.add(textMesh)

      const metrics = getFontMetrics(weight)
      const sceneObject = new TextObject(textMesh, this.caches, size, metrics)
      this.objects.push(sceneObject)
      return sceneObject
    })
  }

  public createSvgObject(
    svgPath: string | string[],
    _color: string,
    _frontColor: string,
    isCCW = false,
  ) {
    const shapes = forceArray(svgPath).flatMap((path) => svgPathToShapePath(path).toShapes(isCCW))
    const geometry = this.shapesToGeometry(shapes)
    geometry.center()

    const svgMesh = this.composeMesh(
      geometry,
      //TODO
      // this.caches.getBasicMaterial(_frontColor),
      // this.caches.getBasicMaterial(_color),
      this.transparentMaterial,
      this.transparentMaterial,
    )
    svgMesh.rotateX(Math.PI)

    geometry.computeBoundingBox()

    this.scene.add(svgMesh)

    const sceneObject = new SvgObject(svgMesh, this.caches)
    this.objects.push(sceneObject)
    return sceneObject
  }

  public createRectangularObject(
    width: number,
    height: number,
    roundingRadius: number,
    _color: string,
    _frontColor: string,
  ) {
    roundingRadius = Math.min(roundingRadius, width / 2, height / 2)

    const rectangularShape = new THREE.Shape()

    if (roundingRadius > EPSILON) {
      const cornerAngle = Math.PI / 2
      rectangularShape.moveTo(-width / 2 + roundingRadius, -height / 2)
      rectangularShape.lineTo(width / 2 - roundingRadius, -height / 2)
      rectangularShape.absarc(
        width / 2 - roundingRadius,
        -height / 2 + roundingRadius,
        roundingRadius,
        -cornerAngle,
        0,
      )
      rectangularShape.lineTo(width / 2, height / 2 - roundingRadius)
      rectangularShape.absarc(
        width / 2 - roundingRadius,
        height / 2 - roundingRadius,
        roundingRadius,
        0,
        cornerAngle,
      )
      rectangularShape.lineTo(-width / 2 + roundingRadius, height / 2)
      rectangularShape.absarc(
        -width / 2 + roundingRadius,
        height / 2 - roundingRadius,
        roundingRadius,
        cornerAngle,
        Math.PI,
      )
      rectangularShape.lineTo(-width / 2, -height / 2 + roundingRadius)
      rectangularShape.absarc(
        -width / 2 + roundingRadius,
        -height / 2 + roundingRadius,
        roundingRadius,
        Math.PI,
        Math.PI * 1.5,
      )
    } else {
      rectangularShape.moveTo(-width / 2, -height / 2)
      rectangularShape.lineTo(width / 2, -height / 2)
      rectangularShape.lineTo(width / 2, height / 2)
      rectangularShape.lineTo(-width / 2, height / 2)
    }

    const geometry = this.shapesToGeometry([rectangularShape])
    geometry.center()

    const mesh = this.composeMesh(
      geometry,
      //TODO
      // this.caches.getBasicMaterial(_frontColor),
      // this.caches.getBasicMaterial(_color),
      this.transparentMaterial,
      this.transparentMaterial,
    )
    this.scene.add(mesh)
    const sceneObject = new RectangularObject(mesh, this.caches)
    this.objects.push(sceneObject)
    return sceneObject
  }

  public loadHexagonalGridBackground() {
    const innerRadius = 24
    const outerRadius = innerRadius / Math.sqrt(3)
    const height = 10
    const scale = 1

    const rowSize = 8
    const colSize = rowSize * HEX_GRID_RATIO

    const geometry = new THREE.CylinderGeometry(
      outerRadius * scale,
      outerRadius * scale,
      height,
      6,
      undefined,
      false,
    )
    const hexagon = new THREE.Mesh(geometry)
    hexagon.position.set(0, 0, 0)
    hexagon.rotateX(Math.PI / 2)

    for (let y = -rowSize; y <= rowSize; y++) {
      for (let x = -colSize; x <= colSize; x++) {
        const mesh = hexagon.clone(false)
        mesh.position.x = innerRadius * x + (y % 2 === 0 ? 0 : innerRadius / 2)
        mesh.position.y = (innerRadius * y * Math.sqrt(3)) / 2
        mesh.position.z = randomFloat(-10, 10)
        // mesh.position.z = 0
        this.backgroundScene.add(mesh)
        this.backgroundGrid.hexagons.push(mesh)
        this.backgroundGrid.initialZPositions.push(mesh.position.z)
      }
    }

    this.backgroundGrid.initializingPhase = true
    this.backgroundGrid.initTimeStart = performance.now()
    this.backgroundGrid.initTimeEnd = this.backgroundGrid.initTimeStart + HEX_GRID_ENTRY_DURATION
  }
}

function getStepSize(filterLen: number, tapsPerPass: number, pass: number) {
  return filterLen * Math.pow(tapsPerPass, -pass)
}
