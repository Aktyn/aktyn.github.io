/* eslint-disable @typescript-eslint/no-require-imports */
import * as THREE from 'three'
import { Addons, type AddonsTypes } from './addons'
import { type Logo } from './objects/logo'
import type { ObjectBase } from './objects/object-base'
import { ReactiveGrid } from './objects/reactiveGrid'
import { Title } from './objects/title'
import { assert } from '../utils/common'

export class Scene3D {
  public static get supported() {
    assert(Addons.ready, 'Addons are not initialized')
    return Addons.LocalWebGL.isWebGL2Available()
  }

  private readonly renderer: THREE.WebGLRenderer
  private composer: InstanceType<AddonsTypes['EffectComposer']>
  private bloomPass: InstanceType<AddonsTypes['UnrealBloomPass']>
  private readonly scene: THREE.Scene
  private readonly camera: THREE.PerspectiveCamera
  private readonly objects: ObjectBase[] = []
  private grid: ObjectBase | null = null
  private logo: Logo | null = null
  private title: Title | null = null

  private readonly stats: Stats

  constructor(container: HTMLElement, width: number, height: number) {
    assert(Addons.ready, 'Addons are not initialized')

    this.scene = this.loadScene()
    this.camera = new THREE.PerspectiveCamera(69, width / height, 0.1, 10)
    this.camera.position.set(0, 0, 1.5)
    this.camera.lookAt(0, 0, 0)

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      depth: true,
      alpha: false,
    })
    container.innerHTML = ''
    container.appendChild(this.renderer.domElement)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(width, height)
    this.renderer.outputColorSpace = THREE.LinearDisplayP3ColorSpace
    this.renderer.setClearColor(0x000000, 1)

    // this.renderer.toneMapping = THREE.ReinhardToneMapping

    const renderScene = new Addons.RenderPass(
      this.scene,
      this.camera,
      undefined,
      new THREE.Color(0x2e343b),
    )

    this.bloomPass = new Addons.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.7,
      0.6,
      0.035,
    )

    const outputPass = new Addons.OutputPass()

    this.composer = new Addons.EffectComposer(this.renderer)
    this.composer.setPixelRatio(window.devicePixelRatio)
    this.composer.addPass(renderScene)
    this.composer.addPass(this.bloomPass)
    this.composer.addPass(outputPass)

    this.resize(width, height)

    this.stats = new Addons.Stats()
    container.appendChild(this.stats.dom)
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

  public run() {
    let lastTime = 0
    const animate: XRFrameRequestCallback = (time) => {
      const delta = Math.min(time - lastTime, 1000) / 1000.0
      for (const object of this.objects) {
        object.update(delta)
      }
      this.composer.render(time)
      this.stats.update()

      lastTime = time
    }
    this.renderer.setAnimationLoop(animate)
  }

  private loadScene() {
    const scene = new THREE.Scene()

    this.grid = new ReactiveGrid(scene)
    this.objects.push(this.grid)

    // this.logo = new Logo(scene)
    // this.objects.push(this.logo, new LogoEdges(scene), new Title(scene))
    this.title = new Title(scene)
    setTimeout(() => {
      this.title?.setTitleModel('titleFullName')
    }, 2_000)

    setTimeout(() => {
      this.title?.setTitleModel('titleAktyn')
    }, 10_000)
    this.objects.push(this.title)

    return scene
  }
}
