import { easeOutExpo } from 'js-easing-functions'
import * as THREE from 'three'
import { ObjectBase } from './object-base'
import { clamp, mix } from '../../utils/math'
import { Assets } from '../assets'
import { smoothValueUpdate } from '../helpers'

const entryAnimationDuration = 4
const startingPosY = -3

export class LogoEdges extends ObjectBase {
  private object: THREE.Object3D | null = null
  private posY = -0.65
  private entryAnimationTimer = entryAnimationDuration

  constructor(scene: THREE.Scene) {
    super(scene)

    const objectScene = Assets.models.logoEdges
    const object = objectScene.children[0] as THREE.Mesh
    if (!(object instanceof THREE.Object3D) || !object.isObject3D) {
      return
    }
    object.position.z = 0
    object.position.y = startingPosY

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00838f,
      // transparent: true,
      // opacity: 0.5,
    })
    object.material = lineMaterial

    this.object = object
    scene.add(this.object)
    this.resize(this.screenWidth, this.screenHeight)
  }

  public destroy() {}

  public resize(width: number, height: number) {
    super.resize(width, height)
    this.object?.scale.setScalar(Math.min(1, width / height) * 0.618)
  }

  public update(delta: number) {
    if (!this.object) {
      return
    }

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
}
