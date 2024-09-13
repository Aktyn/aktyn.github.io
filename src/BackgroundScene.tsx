import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ViewContext, type ViewType } from './context/viewContext'
import { useDebounce } from './hooks/useDebounce'
import { Scene3D } from './scene-3D'
import { Addons } from './scene-3D/addons'
import { Assets } from './scene-3D/assets'

export const BackgroundScene = memo(({ onLoaded }: { onLoaded?: (loaded: true) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { view, scrollValue, scene, setScene } = useContext(ViewContext)

  const [webGlAvailable, setWebGlAvailable] = useState(true)
  const [loading, setLoading] = useState(true)

  const changeViewDebounced = useDebounce(
    (scene: Scene3D, view: ViewType) => {
      scene.setView(view)
    },
    1_000,
    [scene, view],
  )

  useEffect(() => {
    if (loading || !scene) {
      return
    }

    changeViewDebounced(scene, view)
  }, [loading, changeViewDebounced, view, scene])

  useEffect(() => {
    if (loading || !scene) {
      return
    }
    scene.setScrollValue(scrollValue)
  }, [loading, scrollValue, scene])

  useEffect(() => {
    if (!loading && onLoaded) {
      onLoaded(true)
    }
  }, [loading, onLoaded])

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
    setScene(scene)

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
  }, [setScene])

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
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!loading && !webGlAvailable ? (
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
})
