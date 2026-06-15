import { useEffect, useRef } from 'react'
import { clamp } from '~/lib/utils'

export function HexBackground() {
  const canvasGrid = useRef<HTMLCanvasElement>(null)
  const canvasEffect = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasGridElement = canvasGrid.current
    const canvasEffectElement = canvasEffect.current
    const containerElement = canvasGridElement?.parentElement
    if (!canvasGridElement || !canvasEffectElement || !containerElement) {
      return
    }

    canvasGridElement.width = containerElement.clientWidth
    canvasGridElement.height = containerElement.clientHeight

    const ctxGrid = canvasGridElement.getContext('2d', { alpha: true, desynchronized: true })
    const ctxEffect = canvasEffectElement.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctxGrid || !ctxEffect) {
      return
    }

    const radiusRatio = 2 / Math.sqrt(3) // ratio of inner radius to outer radius of hexagon
    const outerRadius = 48 //pixels
    const innerRadius = outerRadius / radiusRatio
    const xStep = innerRadius * 2
    const yStep = outerRadius * 1.5
    const fillPalette = [
      '#ffffff05',
      '#00000005',
      '#ffaaaa05',
      '#aaffaa05',
      '#aaaaff05',
      '#ffffaa05',
      '#ffaaff05',
      '#aaffff05',
    ]

    const fillHex = (x: number, y: number, color: string, ctx = ctxGrid) => {
      ctx.fillStyle = color

      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const vertexX = Math.sin(angle) * outerRadius
        const vertexY = Math.cos(angle) * outerRadius
        ctx.lineTo(x + vertexX, y + vertexY)
      }
      ctx.fill()
    }

    const drawGrid = (ctx = ctxGrid) => {
      const { width, height } = canvasGridElement
      ctx.clearRect(0, 0, width, height)

      ctx.strokeStyle = '#fff1'
      ctx.lineWidth = 1

      ctx.beginPath()
      for (let y = 0; y < height + outerRadius; y += yStep) {
        for (
          let x = Math.floor(y / yStep) % 2 === 0 ? innerRadius : 0;
          x < width + innerRadius;
          x += xStep
        ) {
          ctx.moveTo(x, y + outerRadius)
          for (let i = 1; i <= 3; i++) {
            const angle = (Math.PI / 3) * i
            const vertexX = Math.sin(angle) * outerRadius
            const vertexY = Math.cos(angle) * outerRadius
            ctx.lineTo(x + vertexX, y + vertexY)
          }
        }
      }
      ctx.stroke()

      for (let y = 0; y < height + outerRadius; y += yStep) {
        for (
          let x = Math.floor(y / yStep) % 2 === 0 ? innerRadius : 0;
          x < width + innerRadius;
          x += xStep
        ) {
          const index = Math.floor(x / xStep) + Math.floor(y / yStep) * Math.ceil(width / xStep)
          if (hashInt(index + 10000) % 3 !== 0) {
            continue
          }

          fillHex(x, y, fillPalette[hashInt(index + 1) % fillPalette.length], ctx)
        }
      }
    }

    const getDistanceColor = (px: number, py: number, hexX: number, hexY: number) => {
      const dst = Math.sqrt(Math.pow(px - hexX, 2) + Math.pow(py - hexY, 2)) / (innerRadius * 4)
      const MAX_ALPHA = 32
      const alphaValue = Math.floor(MAX_ALPHA - clamp(Math.pow(dst, 0.5) * MAX_ALPHA, 0, MAX_ALPHA))
      const alphaHex = alphaValue.toString(16).padStart(2, '0')
      return `#ffffff${alphaHex}`
    }

    const boxSize = innerRadius * 10 + 1 // Additional pixel is added to avoid edge artifacts
    /** [x, y, width, height] where x,y is top-left corner */
    const effectBoundingBox = [0, 0, boxSize, boxSize] as [number, number, number, number]

    const drawEffect = (centerX: number, centerY: number, ctx = ctxEffect) => {
      ctx.clearRect(...effectBoundingBox)

      const cx = centerX + innerRadius / 2
      const cy = centerY + outerRadius / 2

      const x =
        Math.floor(cx / xStep) * xStep + (Math.floor(cy / yStep) % 2 === 0 ? innerRadius : 0)
      const y = Math.floor(cy / yStep) * yStep

      effectBoundingBox[0] = x - boxSize / 2
      effectBoundingBox[1] = y - boxSize / 2

      fillHex(x, y, getDistanceColor(centerX, centerY, x, y), ctx)
      for (let i = 1; i <= 6; i++) {
        const angle = (Math.PI / 3) * (i + 0.5)
        const vertexX = Math.sin(angle) * innerRadius * 2
        const vertexY = Math.cos(angle) * innerRadius * 2
        fillHex(
          x + vertexX,
          y + vertexY,
          getDistanceColor(centerX, centerY, x + vertexX, y + vertexY),
          ctx,
        )

        const outerVertexX = Math.sin(angle) * innerRadius * 4
        const outerVertexY = Math.cos(angle) * innerRadius * 4
        fillHex(
          x + outerVertexX,
          y + outerVertexY,
          getDistanceColor(centerX, centerY, x + outerVertexX, y + outerVertexY),
          ctx,
        )

        const angle2 = (Math.PI / 3) * i
        const outerVertexX2 = Math.sin(angle2) * outerRadius * 3
        const outerVertexY2 = Math.cos(angle2) * outerRadius * 3
        fillHex(
          x + outerVertexX2,
          y + outerVertexY2,
          getDistanceColor(centerX, centerY, x + outerVertexX2, y + outerVertexY2),
          ctx,
        )
      }
    }

    const resize = () => {
      const { width, height } = containerElement.getBoundingClientRect()
      canvasGridElement.width = width
      canvasGridElement.height = height
      canvasEffectElement.width = width
      canvasEffectElement.height = height

      drawGrid()
    }

    const mouseMoveHandler = (event: PointerEvent) => {
      drawEffect(event.clientX, event.clientY)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(containerElement)
    document.addEventListener('pointermove', mouseMoveHandler)

    return () => {
      resizeObserver.disconnect()
      document.removeEventListener('pointermove', mouseMoveHandler)
    }
  }, [])

  return (
    <div
      className="
        relative size-full animate-in overflow-hidden delay-1000 duration-1000
        fill-mode-both fade-in
        *:absolute *:inset-0
      "
    >
      <canvas ref={canvasGrid} />
      <canvas ref={canvasEffect} />
    </div>
  )
}

/** Simple integer hashing used to randomize which hexagons in the grid should be colored */
function hashInt(x: number) {
  x = x ^ (x >> 16)
  x *= 0x7feb352d
  x = x ^ (x >> 15)
  x *= 0x846ca68b
  x = x ^ (x >> 16)
  return x
}
