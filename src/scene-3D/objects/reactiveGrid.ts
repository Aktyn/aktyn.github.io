import { easeInOutSine } from 'js-easing-functions'
import * as THREE from 'three'
import { ObjectBase } from './object-base'
import { clamp, mix } from '../../utils/math'
import { Assets } from '../assets'
import { linearValueUpdate, secondaryColor, smoothValueUpdate } from '../helpers'

const morphDuration = 5
enum Mode {
  BACKGROUND,
  LANDSCAPE,
}

export class ReactiveGrid extends ObjectBase {
  public static Mode = Mode

  private readonly mesh: THREE.Object3D
  private readonly lineMaterial: THREE.LineBasicMaterial
  private readonly positionAttribute: THREE.Float32BufferAttribute
  private readonly sizeAttribute: THREE.Float32BufferAttribute
  private readonly initialGrid: Array<[number, number, number]>
  private readonly grid: Array<[number, number, number]>
  private morphTimer = morphDuration
  private waveOffsetX = 0
  private waveOffsetY = 0

  private mode = Mode.BACKGROUND

  constructor(
    scene: THREE.Scene,
    private readonly gridSize = 48,
  ) {
    super(scene)

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

    this.lineMaterial = new THREE.LineBasicMaterial({
      color: 0xb2ebf2,
      transparent: true,
      opacity: 0.0025,
    })
    for (let y = 0; y < gridSize; y++) {
      const lineGeometry = new THREE.BufferGeometry()
      lineGeometry.setAttribute('position', this.positionAttribute)
      lineGeometry.setIndex(Array.from({ length: gridSize }, (_, i) => i + y * gridSize))
      const line = new THREE.Line(lineGeometry, this.lineMaterial)
      this.mesh.add(line)
    }
    for (let x = 0; x < gridSize; x++) {
      const lineGeometry = new THREE.BufferGeometry()
      lineGeometry.setAttribute('position', this.positionAttribute)
      lineGeometry.setIndex(Array.from({ length: gridSize }, (_, i) => i * gridSize + x))
      const line = new THREE.Line(lineGeometry, this.lineMaterial)
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

    // scene.add(this.background, this.mesh)
    scene.add(this.mesh)
  }

  public destroy() {}

  public resize(width: number, height: number) {
    super.resize(width, height)

    const factor = Math.max(width / height, height / width) * 1.2
    this.mesh.scale.setScalar(factor)
  }

  public setMode(mode: Mode) {
    this.mode = mode
  }

  update(delta: number) {
    if (this.morphTimer <= 0) {
      let targetOrientation = 0
      let targetY = 0
      let targetZ = 0
      let targetLinesOpacity = 0.0025

      switch (this.mode) {
        case Mode.BACKGROUND:
          {
            if (!this.mouseX && !this.mouseY) {
              break
            }
            for (let y = 0; y < this.gridSize; y++) {
              for (let x = 0; x < this.gridSize; x++) {
                const i = y * this.gridSize + x

                const vertexX = this.positionAttribute.getX(i)
                const vertexY = this.positionAttribute.getY(i)
                const vertexZ = this.positionAttribute.getZ(i)

                const dstX = vertexX - this.mouseX / this.mesh.scale.x
                const dstY = vertexY - this.mouseY / this.mesh.scale.y

                const dst = Math.min(Math.pow(dstX * dstX + dstY * dstY, 0.7) * 8, Math.PI * 1.5)
                const targetZ = Math.max(-0.095, Math.cos(dst) * 0.1)
                this.positionAttribute.setZ(i, smoothValueUpdate(vertexZ, targetZ, delta * 2))

                const targetY = (y / (this.gridSize - 1) - 0.5) * 2
                this.positionAttribute.setY(i, smoothValueUpdate(vertexY, targetY, delta))

                const targetSize = this.mouseClicked
                  ? clamp(Math.pow(targetZ * 8, 5) * 0.5, 0.02, 0.4)
                  : 0.02
                const size = Math.min(
                  0.5,
                  smoothValueUpdate(this.sizeAttribute.getX(i), targetSize, delta * 8),
                )
                this.sizeAttribute.setX(i, size)
              }
            }
          }
          break
        case Mode.LANDSCAPE:
          {
            targetOrientation = -Math.PI * 0.5
            targetY = -0.25
            targetZ = 0.125
            targetLinesOpacity = 0.0125
            this.waveOffsetX += delta * Math.PI * 2 * 0.05
            this.waveOffsetY += delta * Math.PI * 2 * 0.1

            for (let y = 0; y < this.gridSize; y++) {
              for (let x = 0; x < this.gridSize; x++) {
                const i = y * this.gridSize + x

                const vertexY = this.positionAttribute.getY(i)
                const targetY = y / (this.gridSize - 1) - 0.5
                this.positionAttribute.setY(i, smoothValueUpdate(vertexY, targetY, delta))

                const vertexZ = this.positionAttribute.getZ(i)
                const targetZ =
                  Math.pow(clamp(y / this.gridSize, 0, 1), 8) +
                  Math.sin((y / this.gridSize) * Math.PI * 8 + this.waveOffsetY) * 0.025 +
                  Math.cos((x / this.gridSize) * Math.PI * 12 + this.waveOffsetX) * 0.0125
                this.positionAttribute.setZ(i, smoothValueUpdate(vertexZ, targetZ, delta * 2))

                const size = this.sizeAttribute.getX(i)
                const targetSize = 0.025 // 0.02
                this.sizeAttribute.setX(i, smoothValueUpdate(size, targetSize, delta * 2))
              }
            }
          }
          break
      }
      this.positionAttribute.needsUpdate = true
      this.sizeAttribute.needsUpdate = true

      this.mesh.rotation.x = smoothValueUpdate(this.mesh.rotation.x, targetOrientation, delta)
      this.mesh.position.y = smoothValueUpdate(this.mesh.position.y, targetY, delta)
      this.mesh.position.z = smoothValueUpdate(this.mesh.position.z, targetZ, delta)
      this.lineMaterial.opacity = linearValueUpdate(
        this.lineMaterial.opacity,
        targetLinesOpacity,
        delta * 0.001,
      )
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
