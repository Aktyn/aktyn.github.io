import * as THREE from 'three'
import { SceneObject } from './scene-object'

export interface FontMetrics {
  ascender: number
  descender: number
  unitsPerEm: number
}

export class TextObject extends SceneObject {
  constructor(
    mesh: THREE.Mesh,
    private fontSize: number,
    private fontMetrics: FontMetrics | null,
  ) {
    super(mesh)
  }

  override alignToElement(element: HTMLElement, camera: THREE.PerspectiveCamera) {
    const rect = element.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      return
    }

    let baselineYOffset: number
    if (this.fontMetrics) {
      const { ascender, descender, unitsPerEm } = this.fontMetrics
      const textPxHeight = ((ascender - descender) / unitsPerEm) * this.fontSize
      const leadingHalf = (rect.height - textPxHeight) / 2
      baselineYOffset = leadingHalf + (ascender / unitsPerEm) * this.fontSize
    } else {
      baselineYOffset = rect.height * 0.8
    }

    const baselineY = rect.top + baselineYOffset
    const baselineX = rect.left

    const nx = (baselineX / window.innerWidth) * 2 - 1
    const ny = -(baselineY / window.innerHeight) * 2 + 1

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera)

    const targetPos = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, targetPos)

    this.mesh.position.copy(targetPos)

    const vFov = (camera.fov * Math.PI) / 180
    const visibleHeightAtZ0 = 2 * Math.tan(vFov / 2) * camera.position.z
    const unitsPerPixel = visibleHeightAtZ0 / window.innerHeight

    const scale = unitsPerPixel
    this.mesh.scale.set(scale, scale, 1)
  }
}
