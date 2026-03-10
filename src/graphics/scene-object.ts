import * as THREE from 'three'
import { EPSILON } from './graphics-helpers'
import type { GraphicsCaches } from './caches'

export abstract class SceneObject {
  private _disposed = false

  protected originalPosition = new THREE.Vector3()
  protected originalScale = new THREE.Vector3(1, 1, 1)

  //TODO: remove animation/transition logic if scene objects will not be rendered or smoothly animated

  /**
   * Position relative to the anchor element\
   * Use to animate the object without compromising the alignment
   */
  protected relativePosition = new THREE.Vector3()
  private targetRelativePosition = new THREE.Vector3()

  protected relativeScale = new THREE.Vector3(1, 1, 1)
  private targetRelativeScale = new THREE.Vector3(1, 1, 1)

  private transitionSpeed = 10
  private lowPriority = false
  private lockVisibility = false

  constructor(
    protected readonly mesh: THREE.Mesh,
    private readonly caches: GraphicsCaches,
  ) {}

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

    this.mesh.position.set(
      centerX + this.relativePosition.x,
      centerY + this.relativePosition.y,
      this.relativePosition.z,
    )
    this.originalPosition.set(centerX, centerY, 0)

    // Calculate scale by comparing 3D geometric size to target 3D size
    if (!this.mesh.geometry.boundingBox) {
      this.mesh.geometry.computeBoundingBox()
    }
    const size = new THREE.Vector3()
    this.mesh.geometry.boundingBox?.getSize(size)

    if (size.x > 0 && size.y > 0) {
      this.mesh.scale.set(
        (targetWidth / size.x) * this.relativeScale.x,
        (targetHeight / size.y) * this.relativeScale.y,
        this.relativeScale.z,
      )
      this.originalScale.set(targetWidth / size.x, targetHeight / size.y, 1)
    }

    return { targetWidth, targetHeight }
  }

  moveTo(x: number, y: number, z: number) {
    this.targetRelativePosition.set(x, y, z)
  }

  scaleTo(x: number, y: number, z: number): void
  scaleTo(scale: number): void
  scaleTo(x: number, y?: number, z?: number) {
    if (y === undefined || z === undefined) {
      this.targetRelativeScale.set(x, x, x)
    } else {
      this.targetRelativeScale.set(x, y, z)
    }
  }

  setFrontColor(color: string) {
    const material = this.caches.getBasicMaterial(color)

    if (Array.isArray(this.mesh.material)) {
      this.mesh.material[0] = material
    } else {
      this.mesh.material = material
    }
  }

  private updatePosition() {
    this.mesh.position.set(
      this.originalPosition.x + this.relativePosition.x,
      this.originalPosition.y + this.relativePosition.y,
      this.originalPosition.z + this.relativePosition.z,
    )
  }

  private updateScale() {
    this.mesh.scale.set(
      this.originalScale.x * this.relativeScale.x,
      this.originalScale.y * this.relativeScale.y,
      this.originalScale.z * this.relativeScale.z,
    )
  }

  /** Delta time represents milliseconds between current and previous frame */
  update(deltaTime: number, lowPerformanceMode: boolean) {
    if (!this.isVisible()) {
      return
    }

    if (this.lowPriority && lowPerformanceMode) {
      this.setVisibility(false)
      this.lockVisibility = true
      return
    }

    const dstSquared = this.relativePosition.distanceToSquared(this.targetRelativePosition)
    if (dstSquared > 0) {
      if (dstSquared < EPSILON) {
        this.relativePosition.copy(this.targetRelativePosition)
        this.updatePosition()
        return
      }

      this.relativePosition.lerp(
        this.targetRelativePosition,
        (deltaTime / 1000) * this.transitionSpeed,
      )
      this.updatePosition()
    }

    const dstSquaredScale = this.relativeScale.distanceToSquared(this.targetRelativeScale)
    if (dstSquaredScale > 0) {
      if (dstSquaredScale < EPSILON ** 2) {
        this.relativeScale.copy(this.targetRelativeScale)
        this.updateScale()
        return
      }

      this.relativeScale.lerp(this.targetRelativeScale, (deltaTime / 1000) * this.transitionSpeed)
      this.updateScale()
    }
  }
}
