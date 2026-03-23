import { createContext, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Section, sectionData } from '~/lib/consts'
import { cn } from '~/lib/utils'
import { ProjectedText } from '../projected-elements/projected-text'
import { ProjectedContainer } from '../projected-elements/projected-container'

const SectionContext = createContext<Section | null>(null)

type SectionContainerProps = Omit<ComponentProps<'section'>, 'id'> & {
  section: Section
}

export function SectionContainer({ section, ...sectionProps }: SectionContainerProps) {
  const { t } = useTranslation()

  return (
    <SectionContext value={section}>
      <section
        id={section}
        {...sectionProps}
        className={cn(
          'flex w-full scroll-mt-8 break-after-page flex-col items-center justify-center gap-4 max-3xl:mx-auto max-3xl:max-w-[calc(100%-var(--spacing)*4)] print:gap-0',
          section === Section.MyJourney &&
            '[--background-lighter:var(--background-lighter-tetradic-1)] [--background:var(--background-tetradic-1)] [--foreground-complementary:var(--foreground-tetradic-1-complementary)] [--foreground-darker:var(--foreground-darker-tetradic-1)] [--foreground-lighter:var(--foreground-lighter-tetradic-1)] [--foreground:var(--foreground-tetradic-1)] [--muted-foreground:var(--muted-foreground-tetradic-1)]',
          section === Section.PublicProjects &&
            '[--background-lighter:var(--background-lighter-tetradic-2)] [--background:var(--background-tetradic-2)] [--foreground-complementary:var(--foreground-tetradic-2-complementary)] [--foreground-darker:var(--foreground-darker-tetradic-2)] [--foreground-lighter:var(--foreground-lighter-tetradic-2)] [--foreground:var(--foreground-tetradic-2)] [--muted-foreground:var(--muted-foreground-tetradic-2)]',
          section === Section.TechStack &&
            '[--background-lighter:var(--background-lighter-tetradic-3)] [--background:var(--background-tetradic-3)] [--foreground-complementary:var(--foreground-tetradic-3-complementary)] [--foreground-darker:var(--foreground-darker-tetradic-3)] [--foreground-lighter:var(--foreground-lighter-tetradic-3)] [--foreground:var(--foreground-tetradic-3)] [--muted-foreground:var(--muted-foreground-tetradic-3)]',
          sectionProps.className,
        )}
      >
        {section !== Section.Intro && (
          <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center justify-center gap-8 text-center print:grid-cols-1">
            <SectionTitleLine side="left" />
            <ProjectedText
              data-entry-animation-type="zoom-in"
              as="h2"
              text={t(`sections.${section}.title`, sectionData[section].title)}
              fontSize={36}
              fontWeight="bold"
              className="text-foreground delay-500"
              splitWords={false}
            />
            <SectionTitleLine side="right" />
          </div>
        )}
        {sectionProps.children}
      </section>
    </SectionContext>
  )
}

SectionContainer.Context = SectionContext

function SectionTitleLine({ side }: { side: 'left' | 'right' }) {
  return (
    <ProjectedContainer
      data-entry-animation-type="zoom-in-x"
      as="span"
      rounding={2}
      className={cn(
        'h-0.5 w-full rounded-sm bg-foreground/50 print:hidden',
        side === 'left' && 'origin-right',
        side === 'right' && 'origin-left',
      )}
    />
  )
}
