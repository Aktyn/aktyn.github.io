import { type ComponentPropsWithoutRef, useCallback, useImperativeHandle, useRef } from 'react'
import type { WebScene } from '~/graphics/web-scene'
import { cn } from '~/lib/utils'
import type { ProjectedComponentProps } from '../content-helpers'
import { useProjectedSceneObject } from '../useProjectedSceneObject'

const defaultSize = 24

export type ProjectedIconProps = ProjectedComponentProps & {
  /** Path of svg icon. Only filled path will work. */
  path: string
  viewBox?: string
  size?: number
  isCCW?: boolean
} & Omit<ComponentPropsWithoutRef<'svg'>, 'fontSize'>

export function ProjectedIcon({
  ref: interfaceRef,
  path,
  viewBox = '0 0 24 24',
  size = defaultSize,
  lowPriority = true, // True by default for icons
  isCCW,
  ...svgProps
}: ProjectedIconProps) {
  const ref = useRef<SVGPathElement>(null)

  const objectFactory = useCallback(
    (webScene: WebScene) => {
      const obj = webScene.createSvgObject(path, isCCW)
      if (lowPriority) {
        obj.setLowPriority()
      }
      return obj
    },
    [path, lowPriority, isCCW],
  )
  const projectedScene = useProjectedSceneObject(ref, objectFactory)

  useImperativeHandle(
    interfaceRef,
    () => ({
      ...projectedScene,
      elementRef: ref,
    }),
    [projectedScene, ref],
  )

  return (
    <svg
      viewBox={viewBox}
      {...svgProps}
      className={cn('inline-block', svgProps.className)}
      style={{ width: size, height: size, ...svgProps.style }}
    >
      <path ref={ref} d={path} />
    </svg>
  )
}
