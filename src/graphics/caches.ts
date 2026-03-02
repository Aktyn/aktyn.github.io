import * as THREE from 'three'

//TODO: get rid of material logic if only native text will stay visible

export function buildCaches() {
  /** Grouped by color */
  const basicMaterials = new Map<string, THREE.Material>()

  return {
    dispose() {
      basicMaterials.forEach((material) => material.dispose())
      basicMaterials.clear()
    },

    getBasicMaterial(color: string, options?: THREE.MeshBasicMaterialParameters) {
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
        ...options,
      })
      basicMaterials.set(color, material)

      return material
    },
  }
}

export type GraphicsCaches = ReturnType<typeof buildCaches>
