import { createContext, type PropsWithChildren } from 'react'
import type { WebScene } from '~/graphics/web-scene'

export type SceneProviderProps = PropsWithChildren<{
  webScene: WebScene
}>

export const SceneContext = createContext<WebScene | null>(null)

export function SceneProvider({ webScene, children }: SceneProviderProps) {
  return <SceneContext value={webScene}>{children}</SceneContext>
}
