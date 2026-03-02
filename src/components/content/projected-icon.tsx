import { type ComponentPropsWithoutRef, useCallback, useImperativeHandle, useRef } from 'react'
import { type WebScene } from '~/graphics/web-scene'
import { cn } from '~/lib/utils'
import { colors } from './colors'
import { type ProjectedComponentProps } from './content-helpers'
import { useProjectedSceneObject } from './useProjectedSceneObject'

const defaultSize = 24

type ProjectedIconProps = ProjectedComponentProps & {
  /** Path of 24x24 icon */
  path: string
  size?: number
} & ComponentPropsWithoutRef<'svg'>

export function ProjectedIcon({
  ref: interfaceRef,
  path,
  color = colors.side,
  frontColor = colors.front,
  size = defaultSize,
  ...svgProps
}: ProjectedIconProps) {
  const ref = useRef<SVGPathElement>(null)

  const objectFactory = useCallback(
    (webScene: WebScene) => webScene.createSvgObject(path, color, frontColor),
    [color, frontColor, path],
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
      viewBox="0 0 24 24"
      {...svgProps}
      className={cn('inline', svgProps.className)}
      style={{ width: size, height: size, ...svgProps.style }}
    >
      <path ref={ref} d={path} />
    </svg>
  )
}
