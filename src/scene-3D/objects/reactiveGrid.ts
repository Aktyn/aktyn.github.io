import { easeInOutSine } from 'js-easing-functions'
import * as THREE from 'three'
import { ObjectBase } from './object-base'
import { mix } from '../../utils/math'
import { Assets } from '../assets'
import { secondaryColor, smoothValueUpdate } from '../helpers'

const morphDuration = 5

export class ReactiveGrid extends ObjectBase {
  private readonly background: THREE.Mesh
  private readonly mesh: THREE.Object3D
  private readonly positionAttribute: THREE.Float32BufferAttribute
  private readonly sizeAttribute: THREE.Float32BufferAttribute
  private readonly initialGrid: Array<[number, number, number]>
  private readonly grid: Array<[number, number, number]>
  private morphTimer = morphDuration

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

    this.initialGrid = calculateRingPoints(
      this.gridSize,
      Math.min(this.aspect, 1 / this.aspect) * 0.5,
    )
    this.grid = calculateGridPoints(this.gridSize)

    const gridGeometry = new THREE.BufferGeometry()

    const buffer = this.initialGrid.flat()
    this.positionAttribute = new THREE.Float32BufferAttribute(buffer, 3)
    gridGeometry.setAttribute('position', this.positionAttribute)
    this.sizeAttribute = new THREE.Float32BufferAttribute(
      this.initialGrid.map(() => 0.02),
      1,
    )
    gridGeometry.setAttribute('size', this.sizeAttribute)

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xb2ebf2,
      transparent: true,
      opacity: 0.0025,
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

    const colors = new THREE.Float32BufferAttribute(
      Array.from({ length: gridSize * gridSize })
        .map(() => secondaryColor)
        .flat(),
      3,
    )
    gridGeometry.setAttribute('customColor', colors)
    const dotMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
        pointTexture: { value: Assets.textures.crossParticle },
      },
      vertexShader: Assets.shaders.particleVertex,
      fragmentShader: Assets.shaders.particleFragment,

      blending: THREE.CustomBlending,
      blendAlpha: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.SrcAlphaFactor,
      blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
      depthTest: false,
      transparent: true,
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
    if (this.morphTimer <= 0) {
      if (!this.mouseX && !this.mouseY) {
        return
      }

      for (let i = 0; i < this.grid.length; i++) {
        const x = this.positionAttribute.getX(i)
        const y = this.positionAttribute.getY(i)
        const z = this.positionAttribute.getZ(i)

        const dstX = x - this.mouseX / this.mesh.scale.x
        const dstY = y - this.mouseY / this.mesh.scale.y

        const dst = Math.min(Math.pow(dstX * dstX + dstY * dstY, 0.7) * 8, Math.PI * 1.5)
        const targetZ = Math.max(-0.095, Math.cos(dst) * 0.1)
        this.positionAttribute.setZ(i, smoothValueUpdate(z, targetZ, delta * 2))

        const targetSize = this.mouseClicked
          ? Math.min(0.5, Math.max(0.02, Math.pow(targetZ * 8, 5) * 0.5))
          : 0.02
        const size = smoothValueUpdate(this.sizeAttribute.getX(i), targetSize, delta * 8)
        this.sizeAttribute.setX(i, size)
      }

      this.positionAttribute.needsUpdate = true
      this.sizeAttribute.needsUpdate = true
    } else if (delta < 1) {
      this.morphTimer = Math.max(0, this.morphTimer - delta)
      const factor = easeInOutSine(1 - this.morphTimer / morphDuration, 0, 1, 1)

      for (let i = 0; i < this.positionAttribute.count; i++) {
        const [fromX, fromY, fromZ] = this.initialGrid[i]
        const [toX, toY, toZ] = this.grid[i]

        this.positionAttribute.setXYZ(
          i,
          mix(fromX, toX, factor),
          mix(fromY, toY, factor),
          mix(fromZ, toZ, factor),
        )
      }
      this.positionAttribute.needsUpdate = true
    }
  }
}

function calculateRingPoints(gridSize: number, outerRadius: number) {
  const points: Array<[number, number, number]> = Array.from({ length: gridSize * gridSize })

  for (let y = 0; y < gridSize; y++) {
    const radius = outerRadius * (1 - (y / (gridSize - 1)) * 2)
    const offset = (y / (gridSize - 1) ** 2) * 8
    for (let x = 0; x < gridSize; x++) {
      const index = y * gridSize + x
      points[index] = [
        Math.cos((x / gridSize + offset) * Math.PI * 2) * radius,
        Math.sin((x / gridSize + offset) * Math.PI * 2) * radius,
        Math.sin(offset * gridSize) * 0.25,
      ]
    }
  }
  return points
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
