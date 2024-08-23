export function randomFloat(min: number, max: number, repeat = 1) {
  let result = 1
  for (let i = 0; i < repeat; i++) {
    result *= Math.random() * (max - min) + min
  }

  return result
}
