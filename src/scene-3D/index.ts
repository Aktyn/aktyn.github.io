/* eslint-disable @typescript-eslint/no-require-imports */
import * as THREE from 'three'
import { Logo } from './logo'
import { type ObjectBase } from './object-base'
import { ReactiveGrid } from './reactiveGrid'

const { default: LocalWebGL } = require('three/addons/capabilities/WebGL.js')

export class Scene3D {
  public static get supported() {
    return LocalWebGL.isWebGL2Available()
  }

  private readonly renderer: THREE.WebGLRenderer
  private readonly scene: THREE.Scene
  private readonly camera: THREE.PerspectiveCamera
  private readonly objects: ObjectBase[] = []
  public grid: ReactiveGrid | null = null
  public logo: Logo | null = null

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.scene = this.loadScene()
    this.camera = new THREE.PerspectiveCamera(69, width / height, 0.1, 10)
    this.camera.position.set(0, 0, 1.5)
    this.camera.lookAt(0, 0, 0)

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      depth: false,
    })
    this.renderer.setSize(width, height)
    this.renderer.setClearColor(0x0e141b, 1)
    this.renderer.clearColor()

    this.resize(width, height)
  }

  public destroy() {
    this.renderer.dispose()
  }

  public resize(width: number, height: number) {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    for (const object of this.objects) {
      object.resize(width, height)
    }
  }

  public run() {
    let lastTime = 0
    const animate: XRFrameRequestCallback = (time) => {
      const delta = Math.min(time - lastTime, 1000) / 1000.0
      for (const object of this.objects) {
        object.update(delta)
      }
      // this.renderer.clearDepth()
      // this.renderer.clearColor()
      this.renderer.render(this.scene, this.camera)

      lastTime = time
    }
    this.renderer.setAnimationLoop(animate)
  }

  private loadScene() {
    const scene = new THREE.Scene()

    this.grid = new ReactiveGrid(scene)
    this.objects.push(this.grid)

    this.logo = new Logo(scene)
    this.objects.push(this.logo)

    return scene
  }
}
