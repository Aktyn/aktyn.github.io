export function smoothValueUpdate(from: number, to: number, speed: number) {
  const diff = to - from
  return from + diff * speed
}

export function linearValueUpdate(from: number, to: number, speed: number) {
  const diff = to - from
  return from + Math.sign(diff) * speed
}

export const primaryColor = [0x00 / 255, 0xbc / 255, 0xd4 / 255]
export const secondaryColor = [0xd4 / 255, 0x18 / 255, 0x00 / 255]
