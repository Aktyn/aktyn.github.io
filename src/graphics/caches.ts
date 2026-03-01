import * as THREE from 'three'

export function buildCaches() {
  /** Grouped by color */
  const basicMaterials = new Map<string, THREE.Material>()

  return {
    getBasicMaterial(color: string) {
      const cached = basicMaterials.get(color)
      if (cached) {
        return cached
      }

      const material = new THREE.MeshBasicMaterial({
        color,
        fog: false,
        // depthTest: false,
        // depthWrite: false,
        // metalness: 0.5,
        // roughness: 0.4,
      })
      basicMaterials.set(color, material)

      return material
    },
  }
}
