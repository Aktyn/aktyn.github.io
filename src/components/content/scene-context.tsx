import {
  createContext,
  type PropsWithChildren,
  type RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { isWebglAvailable } from '~/graphics/graphics-helpers'
import { WebScene } from '~/graphics/web-scene'

const webGlEnabledStorageKey = 'webgl-enabled'

export const SceneContext = createContext({
  webScene: null as WebScene | null,
  webGlEnabled: false,
  setWebGlEnabled: (() => void 0) as (enabled: boolean) => void,
})

type SceneProviderProps = PropsWithChildren<{
  containerRef: RefObject<HTMLDivElement | null>
}>

export function SceneProvider({ containerRef, children }: SceneProviderProps) {
  const [webScene, setWebScene] = useState<WebScene | null>(null)

  const storageItem = localStorage.getItem(webGlEnabledStorageKey)
  const [webGlEnabled, internalSetWebGlEnabled] = useState(
    typeof storageItem === 'string' ? storageItem === 'true' : isWebglAvailable(),
  )

  const setWebGlEnabled = useCallback((enabled: boolean) => {
    internalSetWebGlEnabled(enabled)
    localStorage.setItem(webGlEnabledStorageKey, String(enabled))
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !webGlEnabled) {
      return
    }

    const webScene = new WebScene(container)
    webScene.loadHexagonalGridBackground()
    setWebScene(webScene)

    return () => {
      webScene.dispose()
      setWebScene(null)
    }
  }, [containerRef, webGlEnabled])

  return <SceneContext value={{ webScene, webGlEnabled, setWebGlEnabled }}>{children}</SceneContext>
}
