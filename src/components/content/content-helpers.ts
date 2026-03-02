import type { RefObject } from 'react'
import type { SceneObject } from '~/graphics/scene-object'

export type ProjectedComponentRef = {
  sceneObject?: SceneObject | null
  updatePosition?: (() => void) | null
  elementRef: RefObject<Element | null>
}

/** Common properties used in projected components */
export type ProjectedComponentProps = {
  ref?: RefObject<ProjectedComponentRef | null>
  as?: 'div' | 'span' | 'a' | 'button'
  color?: string
  frontColor?: string
}
