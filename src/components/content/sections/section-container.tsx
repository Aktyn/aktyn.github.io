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
          'flex max-w-full scroll-mt-8 flex-col items-center justify-center gap-4 max-3xl:mx-auto max-3xl:max-w-[calc(100%-var(--spacing)*4)]',
          section === Section.MyJourney &&
            '[--background-lighter:var(--background-lighter-tetradic-1)] [--background:var(--background-tetradic-1)] [--foreground-complementary:var(--foreground-tetradic-1-complementary)] [--foreground-darker:var(--foreground-darker-tetradic-1)] [--foreground-lighter:var(--foreground-lighter-tetradic-1)] [--foreground:var(--foreground-tetradic-1)] [--muted-foreground:var(--muted-foreground-tetradic-1)]',
          section === Section.PublicProjects &&
            '[--background-lighter:var(--background-lighter-tetradic-2)] [--background:var(--background-tetradic-2)] [--foreground-complementary:var(--foreground-tetradic-2-complementary)] [--foreground-darker:var(--foreground-darker-tetradic-2)] [--foreground-lighter:var(--foreground-lighter-tetradic-2)] [--foreground:var(--foreground-tetradic-2)] [--muted-foreground:var(--muted-foreground-tetradic-2)]',
          section === Section.TechStack &&
            '[--background-lighter:var(--background-lighter-tetradic-3)] [--background:var(--background-tetradic-3)] [--foreground-complementary:var(--foreground-tetradic-3-complementary)] [--foreground-darker:var(--foreground-darker-tetradic-3)] [--foreground-lighter:var(--foreground-lighter-tetradic-3)] [--foreground:var(--foreground-tetradic-3)] [--muted-foreground:var(--muted-foreground-tetradic-3)]',
          sectionProps.className,
        )}
      />
    </SectionContext>
  )
}

SectionContainer.Context = SectionContext
