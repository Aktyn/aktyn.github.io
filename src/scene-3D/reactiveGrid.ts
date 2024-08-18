import * as THREE from 'three'
import { smoothValueUpdate } from './helpers'
import { ObjectBase } from './object-base'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const dustParticleTexture = require('./textures/vertex.png')

export class ReactiveGrid extends ObjectBase {
  private mesh: THREE.Object3D | null = null
  private positionAttribute: THREE.Float32BufferAttribute | null = null
  private readonly grid: Array<[number, number, number]>
  private mouseX = 0
  private mouseY = 0

  constructor(
    scene: THREE.Scene,
    private readonly gridSize = 64,
  ) {
    super()

    this.mesh = new THREE.Object3D()

    this.grid = calculateGridPoints(this.gridSize)

    const gridGeometry = new THREE.BufferGeometry()

    this.positionAttribute = new THREE.Float32BufferAttribute(this.grid.flat(), 3)
    //? this.positionAttribute.setUsage(THREE.DynamicDrawUsage)
    gridGeometry.setAttribute('position', this.positionAttribute)

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x80deea,
      transparent: true,
      opacity: 0.1,
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
      size: 0.025,
      color: 0xea8c80, // 0x80deea,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.25,
      map: new THREE.TextureLoader().load(dustParticleTexture),
      blending: THREE.AdditiveBlending,
    })
    const dot = new THREE.Points(gridGeometry, dotMaterial)

    this.mesh.add(dot)
    scene.add(this.mesh)
    // this.mesh.scale.setScalar(0.9)
  }

  update(delta: number) {
    if (!this.positionAttribute || (!this.mouseX && !this.mouseY)) {
      return
    }

    for (let i = 0; i < this.grid.length; i++) {
      const x = this.positionAttribute.getX(i)
      const y = this.positionAttribute.getY(i)
      const z = this.positionAttribute.getZ(i)

      const dstX = x - this.mouseX
      const dstY = y - this.mouseY

      const dst = Math.min(Math.pow(dstX * dstX + dstY * dstY, 0.7) * 8, Math.PI * 1.5)
      const targetZ = Math.max(-0.095, Math.cos(dst) * 0.1)

      this.positionAttribute.setZ(i, smoothValueUpdate(z, targetZ, delta * 2))
    }

    this.positionAttribute.needsUpdate = true
  }

  updateMousePosition(x: number, y: number) {
    this.mouseX = x
    this.mouseY = y
  }

  resize() {
    // noop
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
