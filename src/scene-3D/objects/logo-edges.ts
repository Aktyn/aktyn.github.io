import * as THREE from 'three'
import { ObjectBase } from './object-base'
import { Assets } from '../assets'

export class LogoEdges extends ObjectBase {
  private object: THREE.Object3D | null = null

  constructor(scene: THREE.Scene) {
    super(scene)

    const objectScene = Assets.models.logoEdges
    const object = objectScene.children[0] as THREE.Mesh
    if (!(object instanceof THREE.Object3D) || !object.isObject3D) {
      return
    }
    object.position.z = 0.5
    // object.position.x = 1

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00838f,
      // transparent: true,
      // opacity: 0.5,
    })
    object.material = lineMaterial

    this.object = object
    scene.add(this.object)
    this.resize(this.screenWidth, this.screenHeight)
  }

  public destroy() {}

  public resize(width: number, height: number) {
    super.resize(width, height)
    this.object?.scale.setScalar(Math.min(1, width / height) * 0.618)
  }

  public update(delta: number) {
    if (!this.object) {
      return
    }
    this.object.rotation.y += delta * 0.5
  }
}
