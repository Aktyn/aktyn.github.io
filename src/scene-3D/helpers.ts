export function smoothValueUpdate(from: number, to: number, speed: number) {
  const diff = to - from
  return from + diff * speed
}

export function linearValueUpdate(from: number, to: number, speed: number) {
  const diff = to - from
  return from + Math.sign(diff) * speed
}
