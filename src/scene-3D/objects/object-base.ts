import type * as THREE from 'three'

export abstract class ObjectBase {
  protected screenWidth = window.innerWidth
  protected screenHeight = window.innerHeight
  protected mouseX = 0
  protected mouseY = 0

  constructor(protected readonly scene: THREE.Scene) {}

  abstract destroy(): void

  abstract update(delta: number): void

  public resize(width: number, height: number) {
    this.screenWidth = width
    this.screenHeight = height
  }

  public updateMousePosition(x: number, y: number) {
    this.mouseX = x
    this.mouseY = y
  }

  protected get aspect() {
    return this.screenWidth / this.screenHeight
  }
}
