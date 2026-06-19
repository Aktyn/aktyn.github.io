import { useEffect, useRef } from 'react'
import { clamp, cn } from '~/lib/utils'

type HexDigit =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'

type HexBackgroundProps = {
  className?: string
  interactive?: boolean
  /** Outer radius of hexagon */
  hexRadius?: number
  seed?: number
  /** 2-digit hex value for alpha channel */
  paletteOpacity?: `${HexDigit}${HexDigit}`
}

export function HexBackground({
  className,
  interactive = false,
  hexRadius = 48,
  seed = 10_000,
  paletteOpacity = '05',
}: HexBackgroundProps) {
  const canvasGrid = useRef<HTMLCanvasElement>(null)
  const canvasEffect = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasGridElement = canvasGrid.current
    const canvasEffectElement = canvasEffect.current
    const containerElement = canvasGridElement?.parentElement
    if (!canvasGridElement || !containerElement) {
      return
    }

    canvasGridElement.width = containerElement.clientWidth
    canvasGridElement.height = containerElement.clientHeight

    const ctxGrid = canvasGridElement.getContext('2d', { alpha: true, desynchronized: true })
    const ctxEffect = canvasEffectElement?.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctxGrid) {
      return
    }

    const radiusRatio = 2 / Math.sqrt(3) // ratio of inner radius to outer radius of hexagon
    const innerRadius = hexRadius / radiusRatio
    const xStep = innerRadius * 2
    const yStep = hexRadius * 1.5
    const fillPalette = [
      `#ffffff${paletteOpacity}`,
      `#000000${paletteOpacity}`,
      `#ffaaaa${paletteOpacity}`,
      `#aaffaa${paletteOpacity}`,
      `#aaaaff${paletteOpacity}`,
      `#ffffaa${paletteOpacity}`,
      `#ffaaff${paletteOpacity}`,
      `#aaffff${paletteOpacity}`,
    ]

    const fillHex = (x: number, y: number, color: string, ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = color

      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const vertexX = Math.sin(angle) * hexRadius
        const vertexY = Math.cos(angle) * hexRadius
        ctx.lineTo(x + vertexX, y + vertexY)
      }
      ctx.fill()
    }

    const drawGrid = (ctx: CanvasRenderingContext2D) => {
      const { width, height } = canvasGridElement
      ctx.clearRect(0, 0, width, height)

      ctx.strokeStyle = '#fff1'
      ctx.lineWidth = 1

      ctx.beginPath()
      for (let y = 0; y < height + hexRadius; y += yStep) {
        for (
          let x = Math.floor(y / yStep) % 2 === 0 ? innerRadius : 0;
          x < width + innerRadius;
          x += xStep
        ) {
          ctx.moveTo(x, y + hexRadius)
          for (let i = 1; i <= 3; i++) {
            const angle = (Math.PI / 3) * i
            const vertexX = Math.sin(angle) * hexRadius
            const vertexY = Math.cos(angle) * hexRadius
            ctx.lineTo(x + vertexX, y + vertexY)
          }
        }
      }
      ctx.stroke()

      for (let y = 0; y < height + hexRadius; y += yStep) {
        for (
          let x = Math.floor(y / yStep) % 2 === 0 ? innerRadius : 0;
          x < width + innerRadius;
          x += xStep
        ) {
          const index = Math.floor(x / xStep) + Math.floor(y / yStep) * Math.ceil(width / xStep)
          if (hashInt(index + seed) % 3 !== 0) {
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

    const drawEffect = (centerX: number, centerY: number, ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(...effectBoundingBox)

      const cx = centerX + innerRadius / 2
      const cy = centerY + hexRadius / 2

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
        const outerVertexX2 = Math.sin(angle2) * hexRadius * 3
        const outerVertexY2 = Math.cos(angle2) * hexRadius * 3
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
      if (canvasEffectElement) {
        canvasEffectElement.width = width
        canvasEffectElement.height = height
      }

      drawGrid(ctxGrid)
    }

    const mouseMoveHandler = (event: PointerEvent) => {
      if (ctxEffect) {
        drawEffect(event.clientX, event.clientY, ctxEffect)
      }
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(containerElement)
    if (interactive) {
      document.addEventListener('pointermove', mouseMoveHandler)
    }

    return () => {
      resizeObserver.disconnect()
      if (interactive) {
        document.removeEventListener('pointermove', mouseMoveHandler)
      }
    }
  }, [hexRadius, interactive, paletteOpacity, seed])

  return (
    <div
      className={cn(
        `
          relative size-full animate-in overflow-hidden delay-1000 duration-1000
          fill-mode-both fade-in
          *:absolute *:inset-0
        `,
        className,
      )}
    >
      <canvas ref={canvasGrid} />
      {interactive && <canvas ref={canvasEffect} />}
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
