import * as THREE from 'three'
import { Addons, type AddonsTypes } from './addons'
import type { ObjectBase } from './objects/object-base'
import { ReactiveGrid } from './objects/reactiveGrid'
import { Title } from './objects/title'
import { ViewType } from '../context/viewContext'
import { assert } from '../utils/common'
import { clamp } from '../utils/math'

export class Scene3D {
  public static get supported() {
    assert(Addons.ready, 'Addons are not initialized')
    return Addons.LocalWebGL.isWebGL2Available()
  }

  private view = ViewType.ABOUT
  private readonly renderer: THREE.WebGLRenderer
  private composer: InstanceType<AddonsTypes['EffectComposer']>
  private afterImagePass: InstanceType<AddonsTypes['AfterimagePass']>
  // private fxaaPass: InstanceType<AddonsTypes['ShaderPass']>
  private bloomPass: InstanceType<AddonsTypes['UnrealBloomPass']>
  private readonly scene: THREE.Scene
  private readonly camera: THREE.PerspectiveCamera
  private readonly objects: ObjectBase[] = []
  private grid: ReactiveGrid | null = null
  private title: Title | null = null

  private stats: Stats | null = null

  constructor(container: HTMLElement, width: number, height: number) {
    assert(Addons.ready, 'Addons are not initialized')

    this.scene = this.loadInitialScene()
    this.camera = new THREE.PerspectiveCamera(69, width / height, 0.1, 10)
    this.camera.position.set(0, 0, 1.5)
    this.camera.lookAt(0, 0, 0)
    // this.camera.layers.enableAll()

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      depth: true,
      alpha: false,
    })
    try {
      container.innerHTML = ''
      container.appendChild(this.renderer.domElement)
    } catch (e) {
      console.error(e)
    }
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(width, height)
    this.renderer.outputColorSpace = THREE.LinearDisplayP3ColorSpace
    // this.renderer.outputColorSpace = THREE.DisplayP3ColorSpace
    this.renderer.setClearColor(0x000000, 1)

    // this.renderer.toneMapping = THREE.ReinhardToneMapping
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping

    // this.fxaaPass = new Addons.ShaderPass(Addons.FXAAShader)

    this.afterImagePass = new Addons.AfterimagePass(0.92)
    this.afterImagePass.setSize(window.innerWidth, window.innerHeight)

    this.bloomPass = new Addons.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.7,
      0.6,
      0.035,
    )

    const outputPass = new Addons.OutputPass()

    const renderScene = new Addons.RenderPass(
      this.scene,
      this.camera,
      undefined,
      // new THREE.Color(0x2e343b),
      new THREE.Color(0x34383f),
    )
    this.composer = new Addons.EffectComposer(this.renderer)
    this.composer.setPixelRatio(window.devicePixelRatio)
    this.composer.addPass(renderScene)
    this.composer.addPass(this.afterImagePass)
    this.composer.addPass(this.bloomPass)
    // this.composer.addPass(this.fxaaPass)
    this.composer.addPass(outputPass)

    this.resize(width, height)

    if (process.env.NODE_ENV === 'development') {
      this.stats = new Addons.Stats()
      container.appendChild(this.stats.dom)
    }
  }

  public destroy() {
    for (const object of this.objects) {
      object.destroy()
    }
    this.renderer.dispose()
    this.composer.dispose()
  }

  public resize(width: number, height: number) {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    // const pixelRatio = this.renderer.getPixelRatio()
    // this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio)
    // this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio)

    this.afterImagePass.setSize(window.innerWidth, window.innerHeight)

    this.bloomPass.setSize(width, height)
    this.bloomPass.resolution.set(width, height)
    this.renderer.setSize(width, height)
    this.composer.setSize(width, height)
    for (const object of this.objects) {
      object.resize(width, height)
    }
  }

  public updateMousePosition(x: number, y: number) {
    for (const object of this.objects) {
      object.updateMousePosition(x, y)
    }
  }

  public setMouseClicked(clicked: boolean) {
    for (const object of this.objects) {
      object.setMouseClicked(clicked)
    }
  }

  public setScrollValue(factor: number) {
    for (const object of this.objects) {
      object.setScrollValue(factor)
    }
  }

  public setView(view: ViewType) {
    if (view === this.view) {
      return
    }
    this.view = view

    switch (this.view) {
      case ViewType.ABOUT:
        this.title?.setTitleModel('titleAktyn', 3, 0.15)
        break
      case ViewType.WEBSITES:
        this.title?.setTitleModel('titleWebsites', 3, 0.3)
        break
      case ViewType.GAME_DEVELOPMENT:
        this.title?.setTitleModel('titleGameDevelopment', 3, 0.3)
        break
      case ViewType.MICROCONTROLLERS:
        this.title?.setTitleModel('titleMicrocontrollers', 3, 0.3)
        break
      case ViewType.COMPUTER_GRAPHICS:
        this.title?.setTitleModel('titleComputerGraphics', 3, 0.3)
        break
    }

    this.grid?.setMode(
      this.view === ViewType.ABOUT ? ReactiveGrid.Mode.BACKGROUND : ReactiveGrid.Mode.LANDSCAPE,
    )
  }

  public run() {
    let lastTime = 0
    const animate: XRFrameRequestCallback = (time) => {
      const delta = clamp((time - lastTime) / 1000.0, 0, 1.0)
      for (const object of this.objects) {
        object.update(delta)
      }

      // this.camera.layers.enable(LAYER.DEFAULT)
      // this.camera.layers.disable(LAYER.NO_BLOOM)
      // this.scene.traverse(console.log) //TODO: remove
      this.composer.render(time)

      // this.camera.layers.disable(LAYER.DEFAULT)
      // this.camera.layers.enable(LAYER.NO_BLOOM)
      // this.noBloomComposer.render(time)

      this.stats?.update()

      lastTime = time
    }
    this.renderer.setAnimationLoop(animate)
  }

  private loadInitialScene() {
    const scene = new THREE.Scene()

    this.grid = new ReactiveGrid(scene)

    this.title = new Title(scene)
    setTimeout(() => {
      if (this.view === ViewType.ABOUT) {
        this.title?.setTitleModel('titleFullName', 3, 0.3)
      }
    }, 2_000)

    setTimeout(() => {
      if (this.view === ViewType.ABOUT) {
        this.title?.setTitleModel('titleAktyn', 3, 0.15)
      }
    }, 10_000)

    this.objects.push(this.grid, this.title)

    return scene
  }

  public getScene() {
    return this.scene
  }

  public addObject(object: ObjectBase) {
    this.objects.push(object)
  }
  public removeObject(object: ObjectBase) {
    const index = this.objects.indexOf(object)
    if (index !== -1) {
      this.objects.splice(index, 1)
    }
  }
}
