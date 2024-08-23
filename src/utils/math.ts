export function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max)
}

export function mix(value1: number, value2: number, factor: number) {
  return value1 * (1 - factor) + value2 * factor
}
