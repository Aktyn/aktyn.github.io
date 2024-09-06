import * as THREE from 'three'
import { ObjectBase } from './object-base'
import { randomFloat } from '../../utils/random'
import { Assets } from '../assets'
import { smoothValueUpdate } from '../helpers'

//TODO: remove this file if not needed
export class Logo extends ObjectBase {
  private object: THREE.Object3D | null = null
  private positionAttribute: THREE.Float32BufferAttribute | null = null
  private initialPositions: Float32Array | null = null
  private morphed = false

  constructor(scene: THREE.Scene) {
    super(scene)

    const objectScene = Assets.models.logo
    const mesh = objectScene.children[0] as THREE.Mesh
    if (!(mesh instanceof THREE.Mesh) || !mesh.isMesh) {
      return
    }
    mesh.material = new THREE.MeshBasicMaterial({
      color: 0x80deea,
      transparent: true,
      opacity: 0.025,
      // opacity: 0.05,
      wireframe: true,
      wireframeLinewidth: 1,
    })

    this.positionAttribute = mesh.geometry.getAttribute('position') as THREE.Float32BufferAttribute
    this.positionAttribute.setUsage(THREE.DynamicDrawUsage)
    this.initialPositions = Float32Array.from(this.positionAttribute.array)
    this.randomizeVertices()

    const dotMaterial = new THREE.PointsMaterial({
      size: 0.0075,
      color: 0xea8c80,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
      map: Assets.textures.crossParticle,
      blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(mesh.geometry, dotMaterial)
    objectScene.add(points)

    this.object = objectScene
    this.object.position.z = 0.5
    this.object.scale.setScalar(Math.min(1, this.screenWidth / this.screenHeight) * 0.618)
    scene.add(this.object)
  }

  public destroy() {}

  public resize(width: number, height: number) {
    super.resize(width, height)
    this.object?.scale.setScalar(Math.min(1, width / height) * 0.618)
  }

  public update(delta: number) {
    if (!this.object || !this.positionAttribute || !this.initialPositions) {
      return
    }

    if (this.morphed) {
      const damping = 0.1
      this.object.rotation.x = smoothValueUpdate(
        this.object.rotation.x,
        -this.mouseY * Math.PI * damping,
        delta * 2,
      )
      this.object.rotation.y = smoothValueUpdate(
        this.object.rotation.y,
        this.mouseX * Math.PI * damping,
        delta * 2,
      )
    } else {
      let ready = true
      const speedUpThreshold = 0.5
      const threshold = 0.001

      for (let i = 0; i < this.positionAttribute.count; i++) {
        const originalX = this.initialPositions[i * 3 + 0]
        const originalY = this.initialPositions[i * 3 + 1]
        const originalZ = this.initialPositions[i * 3 + 2]

        const x = this.positionAttribute.getX(i)
        const y = this.positionAttribute.getY(i)
        const z = this.positionAttribute.getZ(i)

        const vectorDiff = new THREE.Vector3(originalX - x, originalY - y, originalZ - z)
        const lenSq = vectorDiff.lengthSq()
        const speed =
          lenSq < speedUpThreshold ** 2
            ? Math.max(4, lenSq * 10)
            : Math.max(2, Math.pow(lenSq, 0.1))
        if (lenSq <= threshold ** 2) {
          this.positionAttribute.setXYZ(i, originalX, originalY, originalZ)
          continue
        }
        ready = false

        this.positionAttribute.setXYZ(
          i,
          smoothValueUpdate(x, originalX, delta * speed),
          smoothValueUpdate(y, originalY, delta * speed),
          smoothValueUpdate(z, originalZ, delta * speed),
        )
      }
      this.positionAttribute.needsUpdate = true

      if (ready) {
        this.morphed = true
      }
    }
  }

  private randomizeVertices() {
    if (!this.positionAttribute) {
      return
    }

    for (let i = 0; i < this.positionAttribute.count; i++) {
      const x = this.positionAttribute.getX(i)
      const y = this.positionAttribute.getY(i)
      const z = this.positionAttribute.getZ(i)
      const vertexPos = new THREE.Vector3(x, y, z).normalize().multiplyScalar(randomFloat(0.1, 1))
      this.positionAttribute.setXYZ(i, vertexPos.x, vertexPos.y, Math.abs(vertexPos.z) * 20 + 2)
    }
    this.positionAttribute.needsUpdate = true
  }
}
