import { useContext, useRef } from 'react'
import { ContentLayer } from './components/content/content-layer'
import { SceneContext, SceneProvider } from './components/content/scene-context'

export function App() {
  const sceneContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative not-print:h-dvh not-print:w-dvw not-print:overflow-hidden">
      <div ref={sceneContainerRef} className="pointer-events-none absolute inset-0 print:hidden" />

      <SceneProvider containerRef={sceneContainerRef}>
        <EdgeMask />
        <ContentLayer />
      </SceneProvider>
    </div>
  )
}

/** This component hides edge of the hexagonal grid */
function EdgeMask() {
  const { webGlEnabled } = useContext(SceneContext)

  if (!webGlEnabled) {
    return
  }

  return (
    <div
      className="absolute inset-0 size-full print:hidden"
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
  )
}
