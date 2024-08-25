import { easeOutBounce } from 'js-easing-functions'
import * as THREE from 'three'
import { ObjectBase } from './object-base'
import { assert } from '../../utils/common'
import { clamp, mix } from '../../utils/math'
import { randomFloat } from '../../utils/random'
import { Addons } from '../addons'
import { Assets } from '../assets'
import { smoothValueUpdate } from '../helpers'

const particlesCount = 10_000
const particleLifetime = 4
const primaryColor = [0x00 / 255, 0xbc / 255, 0xd4 / 255]
const secondaryColor = [0xd4 / 255, 0x18 / 255, 0x00 / 255]
const textOpacity = 0.1

export class Title extends ObjectBase {
  private readonly positions: THREE.Float32BufferAttribute
  private readonly colors: THREE.Float32BufferAttribute
  private readonly sizes: THREE.Float32BufferAttribute
  private originalPositions: Readonly<Array<Readonly<THREE.Vector3>>>
  private morphingPositions: Array<THREE.Vector3> | null = null
  private readonly speeds: Array<number>
  private readonly timers: Array<number>
  private readonly angles: Array<number>

  private textObject: THREE.Mesh | null = null
  private pointsObject: THREE.Points
  private posY = 0.8
  private particlesAlpha = 0.3
  private targetParticlesAlpha = 0.3

  private morphDuration = 5
  private morphTimer = 0

  constructor(scene: THREE.Scene) {
    super(scene)

    const positions: Array<THREE.Vector3> = []

    const maxRadius = (Math.max(this.aspect, 1 / this.aspect) * Math.SQRT2) / this.scale
    for (let i = 0; i < particlesCount; i++) {
      const randomAngle = randomFloat(0, Math.PI * 2)
      const randomRadiusOffset = randomFloat(-0.5, 0.5, 3)
      const particle = new THREE.Vector3(
        Math.cos(randomAngle) * (maxRadius + randomRadiusOffset),
        Math.sin(randomAngle) * (maxRadius + randomRadiusOffset) - this.posY / this.scale,
        0,
      )
      particle.setZ(randomFloat(0, 0.05))
      positions.push(particle)
    }

    const emitterGeometry = new THREE.BufferGeometry()
    this.positions = new THREE.Float32BufferAttribute(
      positions.map((point) => point.toArray()).flat(),
      3,
    )
    emitterGeometry.setAttribute('position', this.positions)
    this.originalPositions = positions.map((point) => point.clone())
    this.speeds = positions.map(() => randomFloat(0.0125, 0.025))
    this.timers = positions.map(() => randomFloat(0, particleLifetime))
    this.angles = positions.map(() => randomFloat(0, Math.PI * 2))

    const initialColors = positions.map(() => primaryColor.map((c) => c * 0.15)).flat()
    this.colors = new THREE.Float32BufferAttribute(initialColors, 3)
    this.sizes = new THREE.Float32BufferAttribute(
      positions.map(() => 0.02),
      1,
    )
    emitterGeometry.setAttribute('customColor', this.colors)
    emitterGeometry.setAttribute('size', this.sizes)

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
        pointTexture: { value: Assets.textures.simpleParticle },
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
    this.pointsObject = new THREE.Points(emitterGeometry, material)
    this.pointsObject.scale.setScalar(this.scale)
    this.pointsObject.position.y = this.posY
    scene.add(this.pointsObject)
  }

  public destroy() {}

  private get scale() {
    return Math.min(0.4, this.aspect * 0.4)
  }

  public setTitleModel(
    model: keyof typeof Assets.models & `title${string}`,
    duration = 5,
    alpha = 0.3,
  ) {
    if (this.textObject) {
      this.scene.remove(this.textObject)
      this.textObject.clear()
      this.textObject.removeFromParent()
    }

    const objectScene = Assets.models[model]
    this.textObject = objectScene.children[0].clone() as THREE.Mesh
    if (!(this.textObject instanceof THREE.Object3D) || !this.textObject.isObject3D) {
      throw new Error('Title object is not a mesh')
    }

    const textMaterial = new THREE.MeshBasicMaterial({
      color: 0x00bcd4,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    this.textObject.material = textMaterial
    this.textObject.scale.setScalar(this.scale)
    this.textObject.position.y = this.posY
    this.scene.add(this.textObject)

    // ----------------------------------
    assert(Addons.ready, 'Addons are not initialized')

    const sampler = new Addons.MeshSurfaceSampler(this.textObject)
      .setWeightAttribute('color')
      .build()

    this.morphingPositions = Array.from({ length: particlesCount }, () => new THREE.Vector3())
    for (let i = 0; i < particlesCount; i++) {
      const particle = new THREE.Vector3()
      sampler.sample(particle)
      particle.setZ(randomFloat(0, 0.05))
      this.morphingPositions[i].copy(particle)
    }

    this.targetParticlesAlpha = alpha
    this.morphTimer = this.morphDuration = duration
  }

  resize(width: number, height: number) {
    super.resize(width, height)

    this.textObject?.scale.setScalar(this.scale)
    this.pointsObject.scale.setScalar(this.scale)
  }

  update(delta: number) {
    const textMaterial = Array.isArray(this.textObject?.material)
      ? this.textObject.material[0]
      : this.textObject?.material

    if (this.morphTimer > 0 && this.morphingPositions) {
      if (textMaterial && textMaterial.opacity > 0) {
        textMaterial.opacity = Math.max(0, textMaterial.opacity - delta * 0.1)
      }

      this.morphTimer = Math.max(0, this.morphTimer - delta)
      const morphProgress = 1 - this.morphTimer / this.morphDuration

      for (let i = 0; i < this.positions.count; i++) {
        const waveFactor = clamp(morphProgress * 2 - (i + 1) / this.positions.count, 0, 1)
        const factor = Math.pow(easeOutBounce(waveFactor, 0, 1, 1), 0.25)

        this.positions.setXYZ(
          i,
          mix(this.originalPositions[i].x, this.morphingPositions[i].x, factor),
          mix(this.originalPositions[i].y, this.morphingPositions[i].y, factor),
          mix(this.originalPositions[i].z, this.morphingPositions[i].z, factor),
        )
      }
      this.positions.needsUpdate = true
    } else if (this.morphingPositions) {
      this.originalPositions = this.morphingPositions
      this.morphingPositions = null
    } else {
      if (textMaterial && textMaterial.opacity < textOpacity) {
        textMaterial.opacity = Math.min(textOpacity, textMaterial.opacity + delta * 0.1)
      }

      if (Math.abs(this.particlesAlpha - this.targetParticlesAlpha) > 0.001) {
        this.particlesAlpha = smoothValueUpdate(
          this.particlesAlpha,
          this.targetParticlesAlpha,
          delta,
        )
      } else {
        this.particlesAlpha = this.targetParticlesAlpha
      }

      for (let i = 0; i < this.positions.count; i++) {
        this.timers[i] -= delta
        if (this.timers[i] <= 0) {
          this.timers[i] += particleLifetime

          this.positions.setXYZ(
            i,
            this.originalPositions[i].x,
            this.originalPositions[i].y,
            this.originalPositions[i].z,
          )
        }

        const speed = this.speeds[i]
        const x = this.positions.getX(i) + Math.cos(this.angles[i]) * speed * delta
        const y = this.positions.getY(i) + Math.sin(this.angles[i]) * speed * delta
        const z = this.positions.getZ(i)

        this.positions.setXYZ(i, x, y, z)
        const factor = Math.pow(clamp(1 - this.timers[i] / particleLifetime, 0, 1), 1.5)
        this.colors.setXYZ(
          i,
          mix(
            primaryColor[0] * this.particlesAlpha * 0.5,
            secondaryColor[0] * this.particlesAlpha,
            factor,
          ),
          mix(
            primaryColor[1] * this.particlesAlpha * 0.5,
            secondaryColor[1] * this.particlesAlpha,
            factor,
          ),
          mix(
            primaryColor[2] * this.particlesAlpha * 0.5,
            secondaryColor[2] * this.particlesAlpha,
            factor,
          ),
        )
        this.sizes.setX(
          i,
          ((mix(0.05, 0.01, factor) * this.screenHeight) / 1536) * (this.scale / 0.4),
        )
      }
      this.positions.needsUpdate = true
      this.colors.needsUpdate = true
      this.sizes.needsUpdate = true
    }
  }
}
