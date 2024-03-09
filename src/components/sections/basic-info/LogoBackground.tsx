import { useEffect, useRef, useState } from 'react'
import { AutoSizer } from 'components/common/AutoSizer'

export const LogoBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const angleDegRef = useRef(60)

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !width || !height) {
      return
    }

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    ctx.translate(canvas.width / 2, canvas.height / 2)

    const drawLine = (level: number) => {
      if (level > maxLevel) {
        return
      }
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(lengthOfTheBranches, 0)
      ctx.stroke()
      for (let i = 1; i < branches + 1; i++) {
        ctx.save()
        ctx.translate(gapBetweenTwoBranches * i, 0)
        ctx.scale(0.5, 0.5)
        ctx.save()

        ctx.rotate(angle)
        drawLine(level + 1)
        ctx.restore()
        ctx.save()

        ctx.rotate(-angle)
        drawLine(level + 1)
        ctx.restore()

        ctx.restore()
      }
    }

    const maxLevel = 4
    const branches = 2
    const sides = 6
    const gapBetweenTwoBranches = 200
    const lengthOfTheBranches = 300
    let angle = 0

    let animation: number,
      lastTime = 0
    const animate: FrameRequestCallback = (time) => {
      angle = (angleDegRef.current / 180) * Math.PI

      const deltaTime = (time - lastTime) / 1000
      lastTime = time
      if (deltaTime > 0.5) {
        animation = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
      for (let i = 0; i < sides; i++) {
        drawLine(0)
        ctx.rotate((Math.PI * 2) / sides)
      }

      const dst = Math.pow(Math.max(0, 120 - angleDegRef.current) / 120, 0.5)
      const changeFactor = Math.max(0.03, deltaTime * 30 * dst)
      angleDegRef.current = Math.min(120, angleDegRef.current + changeFactor)
      if (angleDegRef.current < 120) {
        animation = requestAnimationFrame(animate)
      }
    }
    animation = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animation)
    }
  }, [height, width])

  return (
    <AutoSizer absolute delay={16}>
      {({ width, height }) => {
        setTimeout(() => {
          setWidth(width)
          setHeight(height)
        }, 1)
        return <canvas ref={canvasRef} />
      }}
    </AutoSizer>
  )
}
