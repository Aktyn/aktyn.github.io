import * as THREE from "three"

export abstract class SceneObject {
  constructor(protected readonly mesh: THREE.Mesh) {}

  remove() {
    this.mesh.removeFromParent()
  }

  alignToElement(element: HTMLElement, camera: THREE.PerspectiveCamera) {
    const rect = element.getBoundingClientRect()

    // Prevent errors for empty dimensions
    if (rect.width === 0 || rect.height === 0) {
      return
    }

    const nx_left = (rect.left / window.innerWidth) * 2 - 1
    const ny_top = -(rect.top / window.innerHeight) * 2 + 1
    const nx_right = (rect.right / window.innerWidth) * 2 - 1
    const ny_bottom = -(rect.bottom / window.innerHeight) * 2 + 1

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const raycaster = new THREE.Raycaster()

    const topLeft = new THREE.Vector3()
    raycaster.setFromCamera(new THREE.Vector2(nx_left, ny_top), camera)
    raycaster.ray.intersectPlane(plane, topLeft)

    const bottomRight = new THREE.Vector3()
    raycaster.setFromCamera(new THREE.Vector2(nx_right, ny_bottom), camera)
    raycaster.ray.intersectPlane(plane, bottomRight)

    const targetWidth = Math.abs(bottomRight.x - topLeft.x)
    const targetHeight = Math.abs(topLeft.y - bottomRight.y)

    const centerX = (topLeft.x + bottomRight.x) / 2
    const centerY = (topLeft.y + bottomRight.y) / 2

    this.mesh.position.set(centerX, centerY, 0)

    // Calculate scale by comparing 3D geometric size to target 3D size
    if (!this.mesh.geometry.boundingBox) {
      this.mesh.geometry.computeBoundingBox()
    }
    const size = new THREE.Vector3()
    this.mesh.geometry.boundingBox?.getSize(size)

    if (size.x > 0 && size.y > 0) {
      this.mesh.scale.set(targetWidth / size.x, targetHeight / size.y, 1)
    }
  }
}
