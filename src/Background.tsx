import { useEffect, useRef, useState } from 'react'
import { Scene3D } from './scene-3D'

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [webGlAvailable, setWebGlAvailable] = useState(true)

  useEffect(() => {
    const available = Scene3D.supported
    if (!available) {
      setWebGlAvailable(false)
    }

    if (!canvasRef.current || !available) {
      return
    }

    const scene = new Scene3D(canvasRef.current, window.innerWidth, window.innerHeight)
    scene.run()

    const onResize = () => {
      scene.resize(window.innerWidth, window.innerHeight)
    }
    const onMouseMove = (event: MouseEvent) => {
      const relativeX = ((event.clientX - window.innerWidth / 2) / window.innerHeight) * 2
      const relativeY = -(event.clientY / window.innerHeight - 0.5) * 2

      scene.grid?.updateMousePosition(relativeX, relativeY)
      scene.logo?.updateMousePosition(relativeX, relativeY)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      scene.destroy()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {webGlAvailable ? (
        <canvas ref={canvasRef} />
      ) : (
        <div
          style={{
            marginTop: 'auto',
          }}
        >
          WebGL is not available in your browser
        </div>
      )}
    </div>
  )
}
