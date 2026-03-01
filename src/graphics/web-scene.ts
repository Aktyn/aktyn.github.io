import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module'
import {
  GodRaysCombineShader,
  GodRaysDepthMaskShader,
  GodRaysFakeSunShader,
  GodRaysGenerateShader,
} from 'three/addons/shaders/GodRaysShader'
import { buildCaches } from './caches'
import { type FontWeight, getFontMetrics, loadFontShapes } from './fonts'
import { svgPathToShapePath } from './graphics-helpers'
import { SvgObject } from './svg-object'
import { TextObject } from './text-object'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import type { SceneObject } from './scene-object'

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
const SUN_POSITION = new THREE.Vector3(0, 618, -1000)

//TODO: particles bouncing of off the text

export class WebScene {
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene: THREE.Scene
  private readonly camera: THREE.PerspectiveCamera
  private readonly postprocessing: PostprocessingState

  private readonly clipPosition = new THREE.Vector4()
  private readonly screenSpacePosition = new THREE.Vector3()

  private readonly materialDepth = new THREE.MeshDepthMaterial()
  private stats: Stats | null = null

  private readonly objects: Array<SceneObject> = []
  private readonly caches = buildCaches()

  private readonly windowResizeCallback = this.onWindowResize.bind(this)

  private lastTime = 0

  constructor(private readonly container: HTMLDivElement) {
    const width = window.innerWidth
    const height = window.innerHeight

    this.clipPosition = new THREE.Vector4()
    this.screenSpacePosition = new THREE.Vector3()

    this.camera = new THREE.PerspectiveCamera(70, width / height, 10, 1000)
    this.camera.position.z = 200

    this.scene = new THREE.Scene()
    this.materialDepth = new THREE.MeshDepthMaterial()

    // const ambientLight = new THREE.AmbientLight(0xffffff, 5)
    // this.scene.add(ambientLight)
    // const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    // dirLight.position.set(0, 20, 100)
    // dirLight.lookAt(0, 0, 0)
    // // const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10)
    // // this.scene.add(dirLightHelper)
    // this.scene.add(dirLight)

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

    //TODO: remove controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.minDistance = 50
    controls.maxDistance = 500

    if (import.meta.env.DEV) {
      this.stats = new Stats()
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

    for (const sceneObject of this.objects) {
      if (sceneObject.disposed) {
        this.objects.splice(this.objects.indexOf(sceneObject), 1)
        continue
      }

      sceneObject.update(Math.min(1000, deltaTime))
    }

    if (this.postprocessing.enabled) {
      this.clipPosition.set(SUN_POSITION.x, SUN_POSITION.y, SUN_POSITION.z, 1)
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

      // for (const mesh of this.meshes) {
      //   mesh.visible = false
      // }
      this.scene.overrideMaterial = null
      this.renderer.setRenderTarget(this.postprocessing.rtTextureColors)
      this.renderer.render(this.scene, this.camera)

      // for (const mesh of this.meshes) {
      //   mesh.visible = true
      // }

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
      if (this.objects.length > 0) {
        this.renderer.autoClear = false
        this.scene.overrideMaterial = null
        this.renderer.render(this.scene, this.camera)
      }
    } else {
      this.renderer.setRenderTarget(null)
      this.renderer.clear()
      this.renderer.render(this.scene, this.camera)
    }
  }

  public getCamera() {
    return this.camera
  }

  private shapesToGeometry(shapes: THREE.Shape[]) {
    const geometry = new THREE.ExtrudeGeometry(shapes, {
      depth: 2,
      steps: 2,
      bevelEnabled: false,
      bevelThickness: 2,
      bevelSize: 0.5,
      bevelOffset: 0,
      bevelSegments: 4,
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
    color: string,
    frontColor: string,
    weight: FontWeight,
  ) {
    return loadFontShapes(text, size, weight).then((shapes) => {
      const geometry = this.shapesToGeometry(shapes)

      const textMesh = this.composeMesh(
        geometry,
        this.caches.getBasicMaterial(frontColor),
        this.caches.getBasicMaterial(color),
      )
      textMesh.rotateX(Math.PI)

      geometry.computeBoundingBox()

      this.scene.add(textMesh)

      const metrics = getFontMetrics(weight)
      const sceneObject = new TextObject(textMesh, size, metrics)
      this.objects.push(sceneObject)
      return sceneObject
    })
  }

  public createSvgObject(svgPath: string, color: string, frontColor: string, isCCW = false) {
    const shapes = svgPathToShapePath(svgPath).toShapes(isCCW)
    const geometry = this.shapesToGeometry(shapes)
    geometry.center()

    const svgMesh = this.composeMesh(
      geometry,
      this.caches.getBasicMaterial(frontColor),
      this.caches.getBasicMaterial(color),
    )
    svgMesh.rotateX(Math.PI)

    geometry.computeBoundingBox()

    this.scene.add(svgMesh)

    const sceneObject = new SvgObject(svgMesh)
    this.objects.push(sceneObject)
    return sceneObject
  }
}

function getStepSize(filterLen: number, tapsPerPass: number, pass: number) {
  return filterLen * Math.pow(tapsPerPass, -pass)
}
