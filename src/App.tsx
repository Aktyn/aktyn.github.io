import { useEffect, useRef } from "react"
import { ContentLayer } from "./components/content/content-layer"
import { Core } from "./core-logic/core"

export function App() {
  const sceneContainerRef = useRef<HTMLDivElement>(null)
  // const windowSize = useWindowSize()

  useEffect(() => {
    const container = sceneContainerRef.current
    if (!container) {
      return
    }

    const core = new Core(container)

    return () => {
      core.dispose()
    }
  }, [])

  return (
    <div className="relative w-dvw h-dvh *:absolute *:inset-0 *:last:z-20 overflow-hidden">
      {/* TODO: pointer-events-none */}
      <div ref={sceneContainerRef} className="z-10" />
      <ContentLayer />
    </div>
  )
}
