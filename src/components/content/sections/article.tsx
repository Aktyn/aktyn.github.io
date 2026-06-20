import { useContext, useEffect, type ComponentProps } from 'react'
import { useWindowSize } from '~/hooks/useWindowSize'
import { Section } from '~/lib/consts'
import type { JourneySection } from '~/lib/journey-info'
import type { ProjectsGroup } from '~/lib/projects-info'
import type { TechStackCategory } from '~/lib/tech-stack'
import { cn } from '~/lib/utils'
import { SectionContainer } from './section-container'
import { HexBackground } from '../hex-background'

type ArticleProps = ComponentProps<'article'> & {
  articleKey: JourneySection | ProjectsGroup | TechStackCategory
}

export function Article({ articleKey, className, ...props }: ArticleProps) {
  const section = useContext(SectionContainer.Context)
  const { width } = useWindowSize()

  const breakpoint = 1920 // !Must be same as 3xl breakpoint defined in index.css

  const dataProps = width < breakpoint ? { 'data-entry-animation-type': 'fade-in' } : {}

  useEffect(() => {
    if (`#${articleKey}` === location.hash) {
      location.replace(location.href)
    }
  }, [articleKey])

  return (
    <article
      id={articleKey}
      {...dataProps}
      {...props}
      className={cn(
        `
          relative flex w-full scroll-mt-8 flex-col gap-3 overflow-hidden
          rounded-xl border-2 border-border/40 p-3 shadow-xl
          3xl:duration-0
        `,
        `bg-background-lighter`,
        section === Section.MyJourney &&
          `
            border-foreground-tetradic-1/40 from-background-tetradic-1/30
            via-background-tetradic-1/60 to-background-tetradic-1/30
            fill-[color-mix(in_oklch,var(--color-foreground-tetradic-1)_80%,var(--color-foreground))]
            text-[color-mix(in_oklch,var(--color-foreground-tetradic-1)_80%,var(--color-foreground))]
          `,
        section === Section.PublicProjects &&
          `
            border-foreground-tetradic-2/40 from-background-tetradic-2/30
            via-background-tetradic-2/60 to-background-tetradic-2/30
            fill-[color-mix(in_oklch,var(--color-foreground-tetradic-2)_80%,var(--color-foreground))]
            text-[color-mix(in_oklch,var(--color-foreground-tetradic-2)_80%,var(--color-foreground))]
          `,
        section === Section.TechStack &&
          `
            border-foreground-tetradic-3/40 from-background-tetradic-3/30
            via-background-tetradic-3/60 to-background-tetradic-3/30
            fill-[color-mix(in_oklch,var(--color-foreground-tetradic-3)_80%,var(--color-foreground))]
            text-[color-mix(in_oklch,var(--color-foreground-tetradic-3)_80%,var(--color-foreground))]
          `,
        className,
      )}
    >
      <HexBackground className="absolute inset-0 opacity-30" seed={100_000} hexRadius={32} />

      {/* Light source inside the article container */}
      <div
        className="
          pointer-events-none absolute inset-0 bg-radial-[circle_at_50%_38.2%]
          from-foreground-lighter/60 via-foreground-lighter/35 via-25%
          to-black/50 bg-fixed bg-center bg-no-repeat mix-blend-overlay
        "
      ></div>
      {props.children}
    </article>
  )
}
