import { cn } from '~/lib/utils'
import { ProjectedText, type ProjectedTextProps } from './projected-text'
import { type ProjectedComponentRef } from './content-helpers'
import { useRef } from 'react'

type ProjectedButtonProps = ProjectedTextProps & {
  // TODO
}

export function ProjectedButton({ ...projectedTextProps }: Omit<ProjectedButtonProps, 'ref'>) {
  const projectedTextRef = useRef<ProjectedComponentRef>(null)

  const handleClick = () => {
    console.log(projectedTextRef.current?.sceneObject)
  }

  return (
    <ProjectedText
      ref={projectedTextRef}
      {...projectedTextProps}
      className={cn('cursor-pointer', projectedTextProps.className)}
      //TODO: animate Z position on hover and click
      onClick={handleClick}
    />
  )
}
