import type { ElementType, RefObject } from 'react'
import type { SceneObject } from '~/graphics/scene-object'

export type ProjectedComponentRef = {
  sceneObject?: SceneObject | null
  updatePosition?: (() => void) | null
  elementRef: RefObject<Element | null>
}

/** Common properties used in projected components */
export type ProjectedComponentProps<As extends ElementType = 'span'> = {
  ref?: RefObject<ProjectedComponentRef | null>
  as?: As
  /** Low priority objects are hidden when rendering frame time exceeds 18ms threshold */
  lowPriority?: boolean
}
