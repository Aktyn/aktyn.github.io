import * as THREE from "three"

export function buildCaches() {
  /** Grouped by color */
  const basicMaterials = new Map<string, THREE.MeshBasicMaterial>()

  return {
    getBasicMaterial(color: string) {
      const cached = basicMaterials.get(color)
      if (cached) {
        return cached
      }

      const material = new THREE.MeshBasicMaterial({
        color,
        fog: false,
        depthTest: false,
        depthWrite: false,
      })
      basicMaterials.set(color, material)

      return material
    },
  }
}
