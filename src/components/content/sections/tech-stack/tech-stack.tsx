import { type techStack, TechStackCategory, useTechStackInfo } from '~/lib/tech-stack'
import { TechBadge } from '~/components/badges/tech-badge'
import type { ComponentProps } from 'react'
import { cn } from '~/lib/utils'
import { SectionContainer } from '../section-container'
import { Section } from '~/lib/consts'
import { Article } from '../article'

const techStackCategories = Object.values(TechStackCategory)

export function TechStack() {
  const techStackInfo = useTechStackInfo()

  return (
    <SectionContainer section={Section.TechStack}>
      {techStackCategories.map((category) => (
        <Article key={category} articleKey={category}>
          <div className="-m-3 mb-0 flex flex-col items-center gap-2 bg-background/40 p-3">
            <h4 data-entry-animation-type="zoom-in" className="text-lg font-semibold">
              {techStackInfo[category].title}
            </h4>
            <p
              data-entry-animation-type="zoom-in"
              className="text-center text-sm leading-tight font-medium tracking-wide text-balance whitespace-pre-wrap text-muted-foreground"
            >
              {techStackInfo[category].description}
            </p>
          </div>
          <div className="grid items-stretch gap-4 md:grid-cols-[repeat(auto-fit,minmax(calc(var(--spacing)*112),1fr))]">
            {techStackInfo[category].stackGroups.map((stackGroup) => (
              <StackGroup key={stackGroup.title} {...stackGroup} />
            ))}
          </div>
        </Article>
      ))}
    </SectionContainer>
  )
}

type StackGroupProps = ComponentProps<'div'> & {
  title: string
  stack: Array<keyof typeof techStack>
}

function StackGroup({ title, stack, ...divProps }: StackGroupProps) {
  return (
    <div
      data-entry-animation
      {...divProps}
      className={cn(
        'flex max-w-full flex-col items-center gap-2',
        'rounded-lg border border-foreground/20 bg-background-lighter/30 p-2 not-print:shadow-lg',
        divProps.className,
      )}
    >
      {title && <p className="text-sm font-semibold">{title}</p>}
      <div className="inline-flex max-w-full flex-row flex-wrap items-center justify-center gap-2 overflow-hidden">
        {stack.map((tech) => (
          <TechBadge key={tech} tech={tech} className="self-center text-base" />
        ))}
      </div>
    </div>
  )
}
