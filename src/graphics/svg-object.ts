import type * as THREE from 'three'
import { SceneObject } from './scene-object'

export class SvgObject extends SceneObject {
  constructor(mesh: THREE.Mesh) {
    super(mesh)
  }
}
