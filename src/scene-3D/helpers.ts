export function smoothValueUpdate(from: number, to: number, speed: number, epsilon = 1e-4) {
  const diff = to - from
  if (Math.abs(diff) < epsilon) {
    return to
  }
  return from + diff * speed
}

export function linearValueUpdate(from: number, to: number, speed: number) {
  const diff = to - from
  if (Math.abs(diff) < speed) {
    return to
  }
  return from + Math.sign(diff) * speed
}

export const primaryColor = [0x00 / 255, 0xbc / 255, 0xd4 / 255]
export const secondaryColor = [0xd4 / 255, 0x18 / 255, 0x00 / 255]
