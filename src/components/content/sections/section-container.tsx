import { type ComponentProps } from 'react'
import { type Section } from '~/lib/consts'
import { cn } from '~/lib/utils'

type SectionContainerProps = Omit<ComponentProps<'section'>, 'id'> & {
  section: Section
}

export function SectionContainer({ section, ...sectionProps }: SectionContainerProps) {
  return (
    <section
      id={section}
      {...sectionProps}
      className={cn(
        'flex max-w-full flex-col items-center justify-center gap-4 p-4',
        sectionProps.className,
      )}
    />
  )
}
