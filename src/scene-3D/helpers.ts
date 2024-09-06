// export enum LAYER {
//   DEFAULT = 0,
//   NO_BLOOM = 1,
// }

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

export const primaryColorValues = [0x00 / 255, 0xbc / 255, 0xd4 / 255]
export const secondaryColorValues = [0xd4 / 255, 0x18 / 255, 0x00 / 255]

export const primaryColor = primaryColorValues.reduce(
  (acc, curr, index) => acc | ((curr * 255) << ((2 - index) * 8)),
  0,
)
export const secondaryColor = secondaryColorValues.reduce(
  (acc, curr, index) => acc | ((curr * 255) << ((2 - index) * 8)),
  0,
)

export function calculateRingPoints(gridSize: number, outerRadius: number) {
  const points: Array<[number, number, number]> = Array.from({ length: gridSize * gridSize })

  for (let y = 0; y < gridSize; y++) {
    const radius = outerRadius * (1 - (y / (gridSize - 1)) * 2)
    const offset = (y / (gridSize - 1) ** 2) * 8
    for (let x = 0; x < gridSize; x++) {
      const index = y * gridSize + x
      points[index] = [
        Math.cos((x / gridSize + offset) * Math.PI * 2) * radius,
        Math.sin((x / gridSize + offset) * Math.PI * 2) * radius,
        Math.sin(offset * gridSize) * 0.25,
      ]
    }
  }
  return points
}

export function calculateGridPoints(gridSize: number) {
  const gridPoints: Array<[number, number, number]> = Array.from({ length: gridSize * gridSize })
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const index = y * gridSize + x
      gridPoints[index] = [(x / (gridSize - 1) - 0.5) * 2, (y / (gridSize - 1) - 0.5) * 2, 0]
    }
  }
  return gridPoints
}

export function calculateTriangulatedGrid(gridSize: number) {
  const gridPoints = calculateGridPoints(gridSize)

  const indices: number[] = []

  for (let y = 0; y < gridSize - 1; y++) {
    for (let x = 0; x < gridSize - 1; x++) {
      const index = y * gridSize + x
      indices.push(index, index + 1, index + gridSize + 1)
      indices.push(index + gridSize, index, index + gridSize + 1)
    }
  }

  return {
    vertices: new Float32Array(gridPoints.flat()),
    indices,
    uvs: gridPoints.map((p) => [(p[0] + 1) / 2, (p[1] + 1) / 2]).flat(), // [0, 0, 1.0, 0, 1.0, 1.0, 0, 1.0],
  }
}
