import { useCallback, useEffect, useRef, useState } from 'react'
import { Scene3D } from './scene-3D'
import { Addons } from './scene-3D/addons'
import { Assets } from './scene-3D/assets'

export function Background() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [webGlAvailable, setWebGlAvailable] = useState(true)
  const [loading, setLoading] = useState(true)

  const init = useCallback(() => {
    const available = Scene3D.supported
    if (!available) {
      setWebGlAvailable(false)
    }

    if (!containerRef.current || !available) {
      return
    }

    const scene = new Scene3D(containerRef.current, window.innerWidth, window.innerHeight)
    scene.run()

    const onResize = () => {
      scene.resize(window.innerWidth, window.innerHeight)
    }
    const onMouseMove = (event: MouseEvent) => {
      const relativeX = ((event.clientX - window.innerWidth / 2) / window.innerHeight) * 2
      const relativeY = -(event.clientY / window.innerHeight - 0.5) * 2

      scene.updateMousePosition(relativeX, relativeY)
    }
    const onMouseKeyDown = (event: MouseEvent) => {
      if (event.button === 0) {
        scene.setMouseClicked(true)
      }
    }
    const onMouseKeyUp = (event: MouseEvent) => {
      if (event.button === 0) {
        scene.setMouseClicked(false)
      }
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseKeyDown)
    window.addEventListener('mouseup', onMouseKeyUp)

    return () => {
      scene.destroy()
      Assets.destroy()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseKeyDown)
      window.removeEventListener('mouseup', onMouseKeyUp)
    }
  }, [])

  useEffect(() => {
    let cleanup: (() => void) | undefined = undefined
    setLoading(true)

    Addons.initAddons()
      .then(Assets.load)
      .then(() => {
        cleanup = init()
      })
      .catch(console.error)
      .finally(() => setLoading(false))

    return () => {
      cleanup?.()
    }
  }, [init])

  return (
    <div
      ref={containerRef}
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
        justifyContent: 'center',
      }}
    >
      {loading ? (
        <div>Loading...</div>
      ) : webGlAvailable ? (
        <div
          style={{
            marginTop: 'auto',
          }}
        >
          WebGL is not available in your browser
        </div>
      ) : null}
    </div>
  )
}
