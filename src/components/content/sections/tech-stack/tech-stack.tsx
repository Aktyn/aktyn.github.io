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
    <SectionContainer section={Section.TechStack} className="print:gap-0">
      {techStackCategories.map((category) => (
        <Article key={category} articleKey={category} className="print:gap-0">
          <div className="-m-3 mb-0 flex flex-col items-center gap-2 bg-background/40 p-3 print:gap-0">
            <h4 data-entry-animation-type="zoom-in" className="text-lg font-semibold">
              {techStackInfo[category].title}
            </h4>
            <p
              data-entry-animation-type="zoom-in"
              className="text-center text-sm leading-tight font-medium tracking-wide text-balance whitespace-pre-wrap text-muted-foreground"
            >
              {techStackInfo[category].description}
            </p>
            {techStackInfo[category].description2 && (
              <p
                data-entry-animation-type="zoom-in"
                className="text-center text-xs leading-tight font-medium tracking-wide text-balance whitespace-pre-wrap text-muted-foreground print:hidden"
              >
                {techStackInfo[category].description2}
              </p>
            )}
          </div>
          <div className="grid items-stretch gap-4 md:grid-cols-[repeat(auto-fit,minmax(calc(var(--spacing)*112),1fr))] print:grid-cols-2 print:justify-center print:lg:grid-cols-3">
            {techStackInfo[category].stackGroups.map((stackGroup) => (
              <TechStackGroup key={stackGroup.title} {...stackGroup} />
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

export function TechStackGroup({ title, stack, ...divProps }: StackGroupProps) {
  return (
    <div
      data-entry-animation
      {...divProps}
      className={cn(
        'flex max-w-full flex-col items-center gap-2 not-print:not-data-[entry-animation=entered]:scale-120 print:gap-0',
        'rounded-lg border-foreground/20 bg-background-lighter/30 not-print:border not-print:p-2 not-print:shadow-lg print:items-start',
        divProps.className,
      )}
    >
      {title && (
        <p className="text-sm font-semibold">
          {title}
          <span className="not-print:hidden">:</span>
        </p>
      )}
      <div className="inline-flex max-w-full flex-row items-center justify-center gap-2 overflow-hidden not-print:flex-wrap">
        {stack.map((tech) => (
          <TechBadge
            key={tech}
            tech={tech}
            className="self-center text-base print:self-start print:text-xs"
          />
        ))}
      </div>
      {divProps.children}
    </div>
  )
}
