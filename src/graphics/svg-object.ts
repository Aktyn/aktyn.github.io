import type * as THREE from 'three'
import { SceneObject } from './scene-object'

export class SvgObject extends SceneObject {
  constructor(mesh: THREE.Mesh) {
    super(mesh)
  }

  override alignToElement(element: HTMLElement, camera: THREE.PerspectiveCamera) {
    const measurements = super.alignToElement(element, camera)
    this.mesh.position.z -= 1 //fix for different extrude direction (half of the extrude depth)

    return measurements
  }
}
