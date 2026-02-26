import type * as THREE from "three"

export abstract class SceneObject {
  constructor(protected readonly mesh: THREE.Mesh) {}
}
