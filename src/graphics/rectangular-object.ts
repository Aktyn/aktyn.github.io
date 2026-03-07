import type * as THREE from 'three'
import { EXTRUDE_DEPTH } from './graphics-helpers'
import { SceneObject } from './scene-object'

export class RectangularObject extends SceneObject {
  override alignToElement(element: HTMLElement, camera: THREE.PerspectiveCamera) {
    const measurements = super.alignToElement(element, camera)
    this.mesh.position.z -= EXTRUDE_DEPTH / 2 //fix for different extrude direction (half of the extrude depth)
    this.originalPosition.z -= EXTRUDE_DEPTH / 2

    return measurements
  }
}
