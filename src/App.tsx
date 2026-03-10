import { useRef } from 'react'
import { ContentLayer } from './components/content/content-layer'
import { SceneProvider } from './components/content/scene-context'

export function App() {
  const sceneContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative h-dvh w-dvw overflow-hidden bg-background-lighter">
      <div ref={sceneContainerRef} className="pointer-events-none" />

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

      <SceneProvider containerRef={sceneContainerRef}>
        <ContentLayer />
      </SceneProvider>
    </div>
  )
}
