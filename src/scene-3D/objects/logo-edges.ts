import { easeOutExpo } from 'js-easing-functions'
import * as THREE from 'three'
import { ObjectBase } from './object-base'
import { clamp, mix } from '../../utils/math'
import { Assets } from '../assets'
import { linearValueUpdate, smoothValueUpdate } from '../helpers'

const entryAnimationDuration = 4
const startingPosY = -3

export class LogoEdges extends ObjectBase {
  private readonly object: THREE.Object3D
  private posY = -0.65
  private entryAnimationTimer = entryAnimationDuration
  private readonly lineMaterial: THREE.LineBasicMaterial

  constructor(scene: THREE.Scene) {
    super(scene)

    const objectScene = Assets.models.logoEdges
    const object = objectScene.children[0].clone() as THREE.Mesh
    if (!(object instanceof THREE.Object3D) || !object.isObject3D) {
      throw new Error('Logo edges object is not a mesh')
    }
    object.position.z = 0
    object.position.y = startingPosY

    this.lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00838f,
      transparent: true,
      opacity: 1,
    })
    object.material = this.lineMaterial

    this.object = object
    scene.add(this.object)
    this.resize(this.screenWidth, this.screenHeight)
  }

  public destroy() {
    this.scene.remove(this.object)
  }

  public resize(width: number, height: number) {
    super.resize(width, height)
    this.object.scale.setScalar(Math.min(1, width / height) * 0.618)
  }

  public update(delta: number) {
    if (this.entryAnimationTimer > 0) {
      this.entryAnimationTimer -= delta
      const factor = easeOutExpo(
        clamp(1 - this.entryAnimationTimer / entryAnimationDuration, 0, 1),
        0,
        1,
        1,
      )
      this.object.position.y = mix(startingPosY, this.posY, factor)
      this.object.rotation.y = -(1 - factor) * Math.PI * 2

      return
    }

    if (this.scrollValue < 1) {
      const damping = 0.1
      this.object.rotation.x = smoothValueUpdate(
        this.object.rotation.x,
        (-this.mouseY + this.posY * 2) * Math.PI * damping,
        delta * 2,
      )
      this.object.rotation.y = smoothValueUpdate(
        this.object.rotation.y,
        this.mouseX * Math.PI * damping,
        delta * 2,
      )
    }

    const factor = clamp(this.scrollValue, 0, 1)
    this.object.position.z = mix(0, -1.5, factor)
    if (this.scrollValue > 0) {
      this.object.rotation.x = linearValueUpdate(
        this.object.rotation.x,
        mix(0, -Math.PI, Math.pow(factor, 2)),
        delta,
      )
    }
    this.lineMaterial.opacity = mix(0, 1, Math.pow(1 - factor, 4))
  }
}
