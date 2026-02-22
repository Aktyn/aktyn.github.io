import { load } from "opentype.js"
import * as THREE from "three"

export async function loadFont(text: string, fontSize: number) {
  const font = await load("/font/SpaceGrotesk-Regular.ttf")

  if (!font) {
    return
  }

  const shapes = font.getPaths(text, 0, 0, fontSize).flatMap((path) => {
    const shapePath = new THREE.ShapePath()
    path.commands.forEach((command) => {
      switch (command.type) {
        case "M":
          shapePath.moveTo(command.x, command.y)
          break
        case "L":
          shapePath.lineTo(command.x, command.y)
          break
        case "Q":
          shapePath.quadraticCurveTo(
            command.x1,
            command.y1,
            command.x,
            command.y,
          )
          break
        case "C":
          shapePath.bezierCurveTo(
            command.x1,
            command.y1,
            command.x2,
            command.y2,
            command.x,
            command.y,
          )
          break
        case "Z":
          if (shapePath.currentPath) {
            shapePath.currentPath.closePath()
          }
          break
      }
    })
    return shapePath.toShapes(true)
  })

  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 4,
    steps: 2,
    bevelEnabled: false,
    bevelThickness: 2,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 3,
  })
  // const geometry = new THREE.ShapeGeometry(shapes)
  geometry.center()
  // geometry.computeVertexNormals()
  // geometry.normalizeNormals()

  // Invert Y axis for text
  geometry.scale(1, -1, 1)

  return geometry
}
