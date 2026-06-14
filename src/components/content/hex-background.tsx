import { useEffect, useRef } from 'react'

export function HexBackground() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasElement = canvas.current
    const canvasContainer = canvasElement?.parentElement
    if (!canvasElement || !canvasContainer) {
      return
    }

    canvasElement.width = canvasContainer.clientWidth
    canvasElement.height = canvasContainer.clientHeight

    const ctx = canvasElement.getContext('2d', { alpha: true, desynchronized: true })
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

    const draw = () => {
      if (!ctx) {
        return
      }

      const { width, height } = canvasElement
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
          if (hashInt(index + 10000) % 4 !== 0) {
            continue
          }
          ctx.fillStyle = fillPalette[hashInt(index + 1) % fillPalette.length]

          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i
            const vertexX = Math.sin(angle) * outerRadius
            const vertexY = Math.cos(angle) * outerRadius
            ctx.lineTo(x + vertexX, y + vertexY)
          }
          ctx.fill()
        }
      }
    }

    const resize = () => {
      if (!ctx) {
        return
      }

      const { width, height } = canvasContainer.getBoundingClientRect()
      canvasElement.width = width
      canvasElement.height = height

      draw()
    }

    const resizeObserver = new ResizeObserver(() => {
      if (!ctx) {
        return
      }

      resize()
    })
    resizeObserver.observe(canvasContainer)

    return () => resizeObserver.disconnect()
  }, [])

  //TODO: another canvas layer highlighting hexagons under cursor
  return <canvas ref={canvas} />
}

function hashInt(x: number) {
  x = x ^ (x >> 16)
  x *= 0x7feb352d
  x = x ^ (x >> 15)
  x *= 0x846ca68b
  x = x ^ (x >> 16)
  return x
}
