import { type Path } from 'opentype.js'
import * as THREE from 'three'

export const EPSILON = 0.01 // Epsilon can be quite high since the scene scale is large
export const EXTRUDE_DEPTH = 8

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

export function extractPathsFromSvg(svgString: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgString, 'image/svg+xml')
  const path = doc.querySelectorAll('path')
  // return path[0]?.getAttribute('d') ?? ''
  return Array.from(path)
    .reduce((acc, p) => {
      const d = p.getAttribute('d')
      if (d) {
        acc.push(d)
      }
      return acc
    }, [] as string[])
    .join(' ')
}

export function svgPathToShapePath(path: Path | string) {
  const shapePath = new THREE.ShapePath()

  if (typeof path === 'string') {
    const tokens = path.match(/([a-z])|-?\d*\.?\d+(?:[eE][-+]?\d+)?/gi)
    if (!tokens) {
      return shapePath
    }

    const currentPoint = new THREE.Vector2()
    const controlPoint = new THREE.Vector2()
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
          controlPoint.copy(currentPoint)
          shapePath.moveTo(currentPoint.x, currentPoint.y)
          break
        }
        case 'L': {
          const x = nextToken()
          const y = nextToken()
          currentPoint.set(isRel ? currentPoint.x + x : x, isRel ? currentPoint.y + y : y)
          controlPoint.copy(currentPoint)
          shapePath.lineTo(currentPoint.x, currentPoint.y)
          break
        }
        case 'H': {
          const x = nextToken()
          currentPoint.set(isRel ? currentPoint.x + x : x, currentPoint.y)
          controlPoint.copy(currentPoint)
          shapePath.lineTo(currentPoint.x, currentPoint.y)
          break
        }
        case 'V': {
          const y = nextToken()
          currentPoint.set(currentPoint.x, isRel ? currentPoint.y + y : y)
          controlPoint.copy(currentPoint)
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

          controlPoint.set(cx2, cy2)
          shapePath.bezierCurveTo(cx1, cy1, cx2, cy2, cx, cy)
          currentPoint.set(cx, cy)
          break
        }
        case 'S': {
          const rx = currentPoint.x * 2 - controlPoint.x
          const ry = currentPoint.y * 2 - controlPoint.y
          const cx2 = isRel ? currentPoint.x + nextToken() : nextToken()
          const cy2 = isRel ? currentPoint.y + nextToken() : nextToken()
          const cx = isRel ? currentPoint.x + nextToken() : nextToken()
          const cy = isRel ? currentPoint.y + nextToken() : nextToken()

          controlPoint.set(cx2, cy2)
          shapePath.bezierCurveTo(rx, ry, cx2, cy2, cx, cy)
          currentPoint.set(cx, cy)
          break
        }
        case 'Q': {
          const cx1 = isRel ? currentPoint.x + nextToken() : nextToken()
          const cy1 = isRel ? currentPoint.y + nextToken() : nextToken()
          const cx = isRel ? currentPoint.x + nextToken() : nextToken()
          const cy = isRel ? currentPoint.y + nextToken() : nextToken()

          controlPoint.set(cx1, cy1)
          shapePath.quadraticCurveTo(cx1, cy1, cx, cy)
          currentPoint.set(cx, cy)
          break
        }
        case 'T': {
          const rx = currentPoint.x * 2 - controlPoint.x
          const ry = currentPoint.y * 2 - controlPoint.y
          const cx = isRel ? currentPoint.x + nextToken() : nextToken()
          const cy = isRel ? currentPoint.y + nextToken() : nextToken()

          controlPoint.set(rx, ry)
          shapePath.quadraticCurveTo(rx, ry, cx, cy)
          currentPoint.set(cx, cy)
          break
        }
        case 'A': {
          const rx = nextToken()
          const ry = nextToken()
          const xAxisRotation = nextToken()
          const largeArcFlag = nextToken()
          const sweepFlag = nextToken()
          const x = isRel ? currentPoint.x + nextToken() : nextToken()
          const y = isRel ? currentPoint.y + nextToken() : nextToken()

          const start = currentPoint.clone()
          currentPoint.set(x, y)
          controlPoint.copy(currentPoint)
          parseArcCommand(
            shapePath,
            rx,
            ry,
            xAxisRotation,
            largeArcFlag,
            sweepFlag,
            start,
            currentPoint,
          )
          break
        }
        case 'Z': {
          if (shapePath.currentPath) {
            shapePath.currentPath.closePath()
          }
          controlPoint.copy(currentPoint)
          break
        }
        default:
          console.warn(`Unsupported SVG command: ${currentCommand}`)
          while (i < tokens.length && !isNaN(parseFloat(tokens[i]))) {
            i++ // skip numeric arguments of unsupported command
          }
          currentCommand = '' // Reset to avoid reusing the unsupported command
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

/**
 * https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
 * https://mortoray.com/2017/02/16/rendering-an-svg-elliptical-arc-as-bezier-curves/ Appendix: Endpoint to center arc conversion
 * From
 * rx ry x-axis-rotation large-arc-flag sweep-flag x y
 * To
 * aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation
 */
function parseArcCommand(
  path: THREE.ShapePath,
  rx: number,
  ry: number,
  x_axis_rotation: number,
  large_arc_flag: number,
  sweep_flag: number,
  start: THREE.Vector2,
  end: THREE.Vector2,
) {
  if (rx === 0 || ry === 0) {
    // draw a line if either of the radii == 0
    path.lineTo(end.x, end.y)
    return
  }

  x_axis_rotation = (x_axis_rotation * Math.PI) / 180

  // Ensure radii are positive
  rx = Math.abs(rx)
  ry = Math.abs(ry)

  // Compute (x1', y1')
  const dx2 = (start.x - end.x) / 2.0
  const dy2 = (start.y - end.y) / 2.0
  const x1p = Math.cos(x_axis_rotation) * dx2 + Math.sin(x_axis_rotation) * dy2
  const y1p = -Math.sin(x_axis_rotation) * dx2 + Math.cos(x_axis_rotation) * dy2

  // Compute (cx', cy')
  let rxs = rx * rx
  let rys = ry * ry
  const x1ps = x1p * x1p
  const y1ps = y1p * y1p

  // Ensure radii are large enough
  const cr = x1ps / rxs + y1ps / rys

  if (cr > 1) {
    // scale up rx,ry equally so cr == 1
    const s = Math.sqrt(cr)
    rx = s * rx
    ry = s * ry
    rxs = rx * rx
    rys = ry * ry
  }

  const dq = rxs * y1ps + rys * x1ps
  const pq = (rxs * rys - dq) / dq
  let q = Math.sqrt(Math.max(0, pq))
  if (large_arc_flag === sweep_flag) {
    q = -q
  }
  const cxp = (q * rx * y1p) / ry
  const cyp = (-q * ry * x1p) / rx

  // Step 3: Compute (cx, cy) from (cx', cy')
  const cx =
    Math.cos(x_axis_rotation) * cxp - Math.sin(x_axis_rotation) * cyp + (start.x + end.x) / 2
  const cy =
    Math.sin(x_axis_rotation) * cxp + Math.cos(x_axis_rotation) * cyp + (start.y + end.y) / 2

  // Step 4: Compute θ1 and Δθ
  const theta = svgAngle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
  const delta =
    svgAngle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry) %
    (Math.PI * 2)

  if (path.currentPath) {
    path.currentPath.absellipse(
      cx,
      cy,
      rx,
      ry,
      theta,
      theta + delta,
      sweep_flag === 0,
      x_axis_rotation,
    )
  }
}

function svgAngle(ux: number, uy: number, vx: number, vy: number) {
  const dot = ux * vx + uy * vy
  const len = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy)
  let ang = Math.acos(Math.max(-1, Math.min(1, dot / len))) // floating point precision, slightly over values appear
  if (ux * vy - uy * vx < 0) {
    ang = -ang
  }
  return ang
}
