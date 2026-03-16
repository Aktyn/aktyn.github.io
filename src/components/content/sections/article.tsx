import type { ComponentProps } from 'react'
import { Section } from '~/lib/consts'
import type { JourneySection } from '~/lib/journey-info'
import type { ProjectsGroup } from '~/lib/projects-info'
import type { TechStackCategory } from '~/lib/tech-stack'
import { cn } from '~/lib/utils'

type ArticleProps = ComponentProps<'article'> & {
  section: Section
  articleKey: JourneySection | ProjectsGroup | TechStackCategory
}

export function Article({ section, articleKey, className, ...props }: ArticleProps) {
  return (
    <article
      id={articleKey}
      {...props}
      className={cn(
        'relative flex w-full flex-col gap-3 overflow-hidden rounded-xl border-border/40 p-3 not-print:border-2 not-print:shadow-xl',
        'bg-linear-150 from-background/30 via-background/60 to-background/30 bg-repeat print:bg-none!',
        section === Section.MyJourney &&
          'border-foreground-tetradic-1/40 from-background-tetradic-1/30 via-background-tetradic-1/60 to-background-tetradic-1/30 text-[color-mix(in_oklch,var(--color-foreground-tetradic-1)_40%,var(--color-foreground))]',
        section === Section.PublicProjects &&
          'border-foreground-tetradic-2/40 from-background-tetradic-2/30 via-background-tetradic-2/60 to-background-tetradic-2/30 text-[color-mix(in_oklch,var(--color-foreground-tetradic-2)_40%,var(--color-foreground))]',
        section === Section.TechStack &&
          'border-foreground-tetradic-3/40 from-background-tetradic-3/30 via-background-tetradic-3/60 to-background-tetradic-3/30 text-[color-mix(in_oklch,var(--color-foreground-tetradic-3)_40%,var(--color-foreground))]',
        className,
      )}
      style={{
        background: 'linear-gradient(var(--tw-gradient-stops)), url(/img/noise.png)',
        backgroundRepeat: 'repeat',
        backgroundPosition: '0 0',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-[circle_at_50%_38.2%] from-foreground-lighter/50 via-foreground-lighter/25 via-25% to-black/40 bg-fixed bg-center bg-no-repeat mix-blend-overlay print:hidden" />
      {props.children}
    </article>
  )
}
