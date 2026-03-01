import type { RefObject } from 'react'
import type { SceneObject } from '~/graphics/scene-object'

export type ProjectedComponentRef = {
  sceneObject: SceneObject | null
}

/** Common properties used in projected components */
export type ProjectedComponentProps = {
  ref?: RefObject<ProjectedComponentRef | null>
  color?: string
  frontColor?: string
}
