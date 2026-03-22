import {
  useCallback,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
} from 'react'
import type { ProjectedComponentProps } from '../content-helpers'
import { useSizer } from '~/hooks/useSizer'
import { useProjectedSceneObject } from '../useProjectedSceneObject'
import { type WebScene } from '~/graphics/web-scene'

export type ProjectedContainerProps<T extends ElementType> = Omit<ProjectedComponentProps, 'as'> &
  ComponentPropsWithoutRef<T> & {
    as: T
    rounding?: number
  }

export function ProjectedContainer<T extends ElementType>({
  as,
  ref: interfaceRef,
  lowPriority,
  rounding = 0,
  ...props
}: ProjectedContainerProps<T>) {
  const containerRef = useRef<HTMLElement>(null)

  const { width, height } = useSizer(containerRef)

  const objectFactory = useCallback(
    (webScene: WebScene) => {
      if (!width || !height) {
        return null
      }

      const obj = webScene.createRectangularObject(width, height, rounding)
      if (lowPriority) {
        obj.setLowPriority()
      }
      return obj
    },
    [width, height, rounding, lowPriority],
  )

  const projectedScene = useProjectedSceneObject(containerRef, objectFactory)

  useImperativeHandle(
    interfaceRef,
    () => ({
      ...projectedScene,
      elementRef: containerRef,
    }),
    [projectedScene, containerRef],
  )

  const Slot = as as ElementType
  return <Slot {...props} ref={containerRef} />
}
