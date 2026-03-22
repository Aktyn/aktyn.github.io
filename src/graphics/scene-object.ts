import * as THREE from 'three'

export abstract class SceneObject {
  private _disposed = false

  private lowPriority = false
  private lockVisibility = false

  constructor(protected readonly mesh: THREE.Mesh) {}

  dispose() {
    this.mesh.removeFromParent()

    this.mesh.geometry.dispose()
    // Should be mostly handled by cache
    if (this.mesh.material instanceof THREE.Material) {
      this.mesh.material.dispose()
    }

    this._disposed = true
  }

  get disposed() {
    return this._disposed
  }

  setVisibility(visible: boolean) {
    if (this.lockVisibility) {
      return
    }
    this.mesh.visible = visible
  }

  isVisible() {
    return this.mesh.visible
  }

  setLowPriority() {
    this.lowPriority = true
    return this
  }

  alignToElement(element: Element, camera: THREE.PerspectiveCamera) {
    const rect = element.getBoundingClientRect()

    // Prevent errors for empty dimensions
    if (rect.width === 0 || rect.height === 0) {
      return null
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

    return { targetWidth, targetHeight }
  }

  /** Delta time represents milliseconds between current and previous frame */
  update(lowPerformanceMode: boolean) {
    if (!this.isVisible()) {
      return
    }

    if (this.lowPriority && lowPerformanceMode) {
      this.setVisibility(false)
      this.lockVisibility = true
      return
    }
  }
}
