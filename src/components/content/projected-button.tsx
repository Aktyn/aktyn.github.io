import { useEffect, useRef } from 'react'
import { cn } from '~/lib/utils'
import { type ProjectedComponentRef } from './content-helpers'
import { ProjectedText, type ProjectedTextProps } from './projected-text'

type ProjectedButtonProps = ProjectedTextProps & {
  // TODO
}

/** @deprecated */
export function ProjectedButton({ ...projectedTextProps }: Omit<ProjectedButtonProps, 'ref'>) {
  const projectedTextRef = useRef<ProjectedComponentRef>(null)

  useEffect(() => {
    const element = projectedTextRef.current?.elementRef?.current
    if (!element) {
      return
    }

    const onMouseEnter = () => {
      const offset = (projectedTextProps.fontSize ?? 0) / 12
      projectedTextRef.current?.sceneObject?.scaleTo(1, 1.2, offset)
      projectedTextRef.current?.sceneObject?.moveTo(0, 0, offset)
      // projectedTextRef.current?.sceneObject?.setFrontColor('#E0F2F1')
    }

    const onMouseLeave = () => {
      projectedTextRef.current?.sceneObject?.scaleTo(1)
      projectedTextRef.current?.sceneObject?.moveTo(0, 0, 0)
      // projectedTextRef.current?.sceneObject?.setFrontColor(colors.front)
    }

    element.addEventListener('mouseenter', onMouseEnter)
    element.addEventListener('mouseleave', onMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', onMouseEnter)
      element.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [projectedTextProps.fontSize])

  return (
    <ProjectedText
      ref={projectedTextRef}
      as="button"
      {...projectedTextProps}
      splitWords={false}
      className={cn('inline', projectedTextProps.className)}
      // onClick={handleClick}
    />
  )
}
