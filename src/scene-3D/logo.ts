/* eslint-disable @typescript-eslint/no-require-imports */
import * as THREE from 'three'
import { smoothValueUpdate } from './helpers'
import { ObjectBase } from './object-base'

const { GLTFLoader } = require('three/addons/loaders/GLTFLoader.js')
const logoModel = require('./models/logo.glb')
const dustParticleTexture = require('./textures/vertex.png')

export class Logo extends ObjectBase {
  private object: THREE.Object3D | null = null
  private mouseX = 0
  private mouseY = 0

  constructor(scene: THREE.Scene) {
    super()

    const loader: THREE.Loader = new GLTFLoader()

    loader.load(
      logoModel,
      (gltf) => {
        const objectScene = (gltf as { scene: THREE.Object3D }).scene
        if (!objectScene.children?.length) {
          return
        }
        const mesh = objectScene.children[0]
        if (!(mesh instanceof THREE.Mesh) || !mesh.isMesh) {
          return
        }
        mesh.material = new THREE.MeshBasicMaterial({
          color: 0x80deea,
          transparent: true,
          opacity: 0.025,
          wireframe: true,
          wireframeLinewidth: 1,
        })

        const dotMaterial = new THREE.PointsMaterial({
          size: 0.02,
          color: 0xffffff,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.025,
          map: new THREE.TextureLoader().load(dustParticleTexture),
          blending: THREE.AdditiveBlending,
        })
        const dot = new THREE.Points(mesh.geometry, dotMaterial)
        objectScene.add(dot)

        this.object?.position.setZ(50)
        this.object = objectScene
        scene.add(this.object)

        console.info(`Loaded ${logoModel}`)
      },
      undefined,
      (error) => {
        console.error(error)
      },
    )
  }

  public resize(width: number, height: number) {
    this.object?.scale.setScalar(Math.min(1, width / height))
  }

  public update(delta: number) {
    if (!this.object) {
      return
    }
    const damping = 0.1
    this.object.rotation.x = smoothValueUpdate(
      this.object.rotation.x,
      -this.mouseY * Math.PI * damping,
      delta * 2,
    )
    this.object.rotation.y = smoothValueUpdate(
      this.object.rotation.y,
      this.mouseX * Math.PI * damping,
      delta * 2,
    )
  }

  updateMousePosition(x: number, y: number) {
    this.mouseX = x
    this.mouseY = y
  }
}
