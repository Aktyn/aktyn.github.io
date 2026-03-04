import { useEffect, useRef, useState } from 'react'
import { ContentLayer } from './components/content/content-layer'
import { SceneProvider } from './components/content/scene-provider'
import { WebScene } from './graphics/web-scene'

export function App() {
  const sceneContainerRef = useRef<HTMLDivElement>(null)
  const [webScene, setWebScene] = useState<WebScene | null>(null)
  // const windowSize = useWindowSize()

  useEffect(() => {
    const container = sceneContainerRef.current
    if (!container) {
      return
    }

    const webScene = new WebScene(container)
    webScene.loadHexagonalGridBackground()
    setWebScene(webScene)

    return () => {
      webScene.dispose()
      setWebScene(null)
    }
  }, [])

  return (
    <div className="relative h-dvh w-dvw overflow-hidden">
      <div
        ref={sceneContainerRef}
        // className="pointer-events-none"
      />

      {/* This div hides edge of the hexagonal grid */}
      <div
        className="absolute inset-0 size-full"
        style={{
          backgroundImage: `linear-gradient(
              90deg,
              var(--color-background-visual) 0%,
              var(--color-background-visual) calc(50% - 140dvh),
              transparent calc(50% - 100dvh),
              transparent calc(50% + 100dvh),
              var(--color-background-visual) calc(50% + 140dvh),
              var(--color-background-visual) 100%
            )`,
        }}
      />

      {/* Main background colors gradient */}
      <div className="absolute inset-0 size-full bg-radial-[circle_at_50%_13%] from-[color-mix(in_oklch,var(--color-background-visual)_80%,var(--color-red-400))] to-[color-mix(in_oklch,var(--color-background-visual)_70%,var(--color-blue-600))] mix-blend-color" />

      {webScene && (
        <SceneProvider webScene={webScene}>
          <ContentLayer webScene={webScene} />
        </SceneProvider>
      )}
    </div>
  )
}
