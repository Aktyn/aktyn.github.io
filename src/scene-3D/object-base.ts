export abstract class ObjectBase {
  abstract update(delta: number): void
  abstract resize(width: number, height: number): void
}
