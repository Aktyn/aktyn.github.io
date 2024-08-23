import * as THREE from 'three'
import { ObjectBase } from './object-base'
import { Assets } from '../assets'
import { smoothValueUpdate } from '../helpers'

export class ReactiveGrid extends ObjectBase {
  private readonly background: THREE.Mesh
  private readonly mesh: THREE.Object3D
  private readonly positionAttribute: THREE.Float32BufferAttribute
  private readonly grid: Array<[number, number, number]>

  constructor(
    scene: THREE.Scene,
    private readonly gridSize = 48,
  ) {
    super(scene)

    const planeGeometry = new THREE.PlaneGeometry(3, 3)
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x4e545b,
      transparent: true,
      opacity: 0.1,
    })
    this.background = new THREE.Mesh(planeGeometry, planeMaterial)
    this.background.position.z = -0.5
    this.mesh = new THREE.Object3D()

    this.grid = calculateGridPoints(this.gridSize)

    const gridGeometry = new THREE.BufferGeometry()

    this.positionAttribute = new THREE.Float32BufferAttribute(this.grid.flat(), 3)
    gridGeometry.setAttribute('position', this.positionAttribute)

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xb2ebf2,
      transparent: true,
      // opacity: 0.025,
      opacity: 0.005,
    })
    for (let y = 0; y < gridSize; y++) {
      const lineGeometry = new THREE.BufferGeometry()
      lineGeometry.setAttribute('position', this.positionAttribute)
      lineGeometry.setIndex(Array.from({ length: gridSize }, (_, i) => i + y * gridSize))
      const line = new THREE.Line(lineGeometry, lineMaterial)
      this.mesh.add(line)
    }
    for (let x = 0; x < gridSize; x++) {
      const lineGeometry = new THREE.BufferGeometry()
      lineGeometry.setAttribute('position', this.positionAttribute)
      lineGeometry.setIndex(Array.from({ length: gridSize }, (_, i) => i * gridSize + x))
      const line = new THREE.Line(lineGeometry, lineMaterial)
      this.mesh.add(line)
    }

    const dotMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff, // 0x0e141b,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.1,
      // opacity: 0.2,
      map: Assets.textures.crossParticle,
      blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(gridGeometry, dotMaterial)
    this.mesh.add(points)

    scene.add(this.background, this.mesh)
  }

  public destroy() {}

  public resize(width: number, height: number) {
    super.resize(width, height)

    const factor = Math.max(width / height, height / width) * 1.2
    this.background.scale.setScalar(factor)
    this.mesh.scale.setScalar(factor)
  }

  update(delta: number) {
    if (!this.mouseX && !this.mouseY) {
      return
    }

    //TODO: morph enter grid

    for (let i = 0; i < this.grid.length; i++) {
      const x = this.positionAttribute.getX(i)
      const y = this.positionAttribute.getY(i)
      const z = this.positionAttribute.getZ(i)

      const dstX = x - this.mouseX / this.mesh.scale.x
      const dstY = y - this.mouseY / this.mesh.scale.y

      const dst = Math.min(Math.pow(dstX * dstX + dstY * dstY, 0.7) * 8, Math.PI * 1.5)
      const targetZ = Math.max(-0.095, Math.cos(dst) * 0.1)

      this.positionAttribute.setZ(i, smoothValueUpdate(z, targetZ, delta * 2))
    }

    this.positionAttribute.needsUpdate = true
  }
}

function calculateGridPoints(gridSize: number) {
  const gridPoints: Array<[number, number, number]> = Array.from({ length: gridSize * gridSize })
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const index = y * gridSize + x
      gridPoints[index] = [(x / (gridSize - 1) - 0.5) * 2, (y / (gridSize - 1) - 0.5) * 2, 0]
    }
  }
  return gridPoints
}
