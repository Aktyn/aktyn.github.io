import { type Path } from 'opentype.js'
import * as THREE from 'three'

export const EPSILON = 0.01 // Epsilon can be quite high since the scene scale is large
export const EXTRUDE_DEPTH = 2

export function isWebglAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    )
  } catch (error) {
    console.error('WebGL not available:', error)
    return false
  }
}

export function svgPathToShapePath(path: Path | string) {
  const shapePath = new THREE.ShapePath()

  if (typeof path === 'string') {
    const tokens = path.match(/([mzlhvcsqta])|-?\d*\.?\d+(?:[eE][-+]?\d+)?/gi)
    if (!tokens) {
      return shapePath
    }

    const currentPoint = new THREE.Vector2()
    let currentCommand = ''
    let i = 0

    const nextToken = () => parseFloat(tokens[i++] || '0')

    while (i < tokens.length) {
      const token = tokens[i]
      if (isNaN(parseFloat(token))) {
        currentCommand = tokens[i++]
      } else {
        if (!currentCommand) {
          break
        }
        // For M/m, subsequent pairs of coordinates are treated as L/l
        if (currentCommand === 'M') {
          currentCommand = 'L'
        } else if (currentCommand === 'm') {
          currentCommand = 'l'
        }
      }

      const isRel = currentCommand.toLowerCase() === currentCommand

      switch (currentCommand.toUpperCase()) {
        case 'M': {
          const x = nextToken()
          const y = nextToken()
          currentPoint.set(isRel ? currentPoint.x + x : x, isRel ? currentPoint.y + y : y)
          shapePath.moveTo(currentPoint.x, currentPoint.y)
          break
        }
        case 'L': {
          const x = nextToken()
          const y = nextToken()
          currentPoint.set(isRel ? currentPoint.x + x : x, isRel ? currentPoint.y + y : y)
          shapePath.lineTo(currentPoint.x, currentPoint.y)
          break
        }
        case 'H': {
          const x = nextToken()
          currentPoint.set(isRel ? currentPoint.x + x : x, currentPoint.y)
          shapePath.lineTo(currentPoint.x, currentPoint.y)
          break
        }
        case 'V': {
          const y = nextToken()
          currentPoint.set(currentPoint.x, isRel ? currentPoint.y + y : y)
          shapePath.lineTo(currentPoint.x, currentPoint.y)
          break
        }
        case 'C': {
          const cx1 = isRel ? currentPoint.x + nextToken() : nextToken()
          const cy1 = isRel ? currentPoint.y + nextToken() : nextToken()
          const cx2 = isRel ? currentPoint.x + nextToken() : nextToken()
          const cy2 = isRel ? currentPoint.y + nextToken() : nextToken()
          const cx = isRel ? currentPoint.x + nextToken() : nextToken()
          const cy = isRel ? currentPoint.y + nextToken() : nextToken()

          shapePath.bezierCurveTo(cx1, cy1, cx2, cy2, cx, cy)
          currentPoint.set(cx, cy)
          break
        }
        case 'Q': {
          const cx1 = isRel ? currentPoint.x + nextToken() : nextToken()
          const cy1 = isRel ? currentPoint.y + nextToken() : nextToken()
          const cx = isRel ? currentPoint.x + nextToken() : nextToken()
          const cy = isRel ? currentPoint.y + nextToken() : nextToken()

          shapePath.quadraticCurveTo(cx1, cy1, cx, cy)
          currentPoint.set(cx, cy)
          break
        }
        case 'Z': {
          if (shapePath.currentPath) {
            shapePath.currentPath.closePath()
          }
          break
        }
        default:
          break
      }
    }
  } else {
    path.commands.forEach((command) => {
      switch (command.type) {
        case 'M':
          shapePath.moveTo(command.x, command.y)
          break
        case 'L':
          shapePath.lineTo(command.x, command.y)
          break
        case 'Q':
          shapePath.quadraticCurveTo(command.x1, command.y1, command.x, command.y)
          break
        case 'C':
          shapePath.bezierCurveTo(
            command.x1,
            command.y1,
            command.x2,
            command.y2,
            command.x,
            command.y,
          )
          break
        case 'Z':
          if (shapePath.currentPath) {
            shapePath.currentPath.closePath()
          }
          break
      }
    })
  }

  return shapePath
}
