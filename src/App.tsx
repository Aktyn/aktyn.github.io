import { useEffect, useRef, useState } from "react"
import { ContentLayer } from "./components/content/content-layer"
import { WebScene } from "./graphics/web-scene"

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
    setWebScene(webScene)

    return () => {
      webScene.dispose()
      setWebScene(null)
    }
  }, [])

  return (
    <div className="relative w-dvw h-dvh *:absolute *:inset-0 *:last:z-20 overflow-hidden">
      <div ref={sceneContainerRef} className="pointer-events-none" />
      {webScene && <ContentLayer webScene={webScene} />}
    </div>
  )
}
