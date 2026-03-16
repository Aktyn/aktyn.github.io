import { createContext, type ComponentProps } from 'react'
import { Section } from '~/lib/consts'
import { cn } from '~/lib/utils'

const SectionContext = createContext<Section | null>(null)

type SectionContainerProps = Omit<ComponentProps<'section'>, 'id'> & {
  section: Section
}

export function SectionContainer({ section, ...sectionProps }: SectionContainerProps) {
  return (
    <SectionContext value={section}>
      <section
        id={section}
        {...sectionProps}
        className={cn(
          'flex max-w-full flex-col items-center justify-center gap-4 max-3xl:mx-auto max-3xl:max-w-[calc(100%-var(--spacing)*4)]',
          section === Section.MyJourney &&
            '[--background-lighter:var(--background-tetradic-1-lighter)] [--background:var(--background-tetradic-1)] [--foreground-darker:var(--foreground-darker-tetradic-1)] [--foreground:var(--foreground-tetradic-1)] [--muted-foreground:var(--muted-foreground-tetradic-1)]',
          section === Section.PublicProjects &&
            '[--background-lighter:var(--background-tetradic-2-lighter)] [--background:var(--background-tetradic-2)] [--foreground-darker:var(--foreground-darker-tetradic-2)] [--foreground:var(--foreground-tetradic-2)] [--muted-foreground:var(--muted-foreground-tetradic-2)]',
          section === Section.TechStack &&
            '[--background-lighter:var(--background-tetradic-3-lighter)] [--background:var(--background-tetradic-3)] [--foreground-darker:var(--foreground-darker-tetradic-3)] [--foreground:var(--foreground-tetradic-3)] [--muted-foreground:var(--muted-foreground-tetradic-3)]',
          sectionProps.className,
        )}
      />
    </SectionContext>
  )
}

SectionContainer.Context = SectionContext
