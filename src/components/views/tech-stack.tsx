import { type techStack, TechStackCategory, techStackInfo } from '~/lib/tech-stack'
import { TechBadge } from '~/components/badges/tech-badge'
import type { ComponentProps } from 'react'
import { cn } from '~/lib/utils'

const techStackCategories = Object.values(TechStackCategory)
const DELAY_BASE = 100

export function TechStack() {
  return (
    <div className="flex size-full min-h-full max-w-full flex-col items-stretch justify-center gap-y-16 p-6">
      {techStackCategories.map((category, index, arr) => {
        const delay =
          DELAY_BASE *
          (index +
            arr
              .slice(0, index)
              .reduce((acc, curr) => acc + techStackInfo[curr].stackGroups.length, 0))

        return (
          <div key={category} className="flex flex-col gap-4">
            <div
              className="flex view-transition-base flex-col items-center gap-4 glass-card"
              style={{
                animationDelay: `${delay}ms`,
              }}
            >
              <h4 className="text-base font-semibold">{techStackInfo[category].title}</h4>
              <p className="text-center text-sm leading-tight tracking-wide text-balance whitespace-pre-wrap text-[color-mix(in_oklab,var(--color-foreground)_80%,var(--color-background))]">
                {techStackInfo[category].description}
              </p>
            </div>
            <div className="grid items-stretch gap-4 md:grid-cols-[repeat(auto-fit,minmax(calc(var(--spacing)*96),1fr))]">
              {techStackInfo[category].stackGroups.map((stackGroup, groupIndex) => (
                <StackGroup
                  key={stackGroup.title}
                  {...stackGroup}
                  style={{
                    animationDelay: `${delay + (groupIndex + 1) * DELAY_BASE}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

type StackGroupProps = ComponentProps<'div'> & {
  title: string
  stack: Array<keyof typeof techStack>
}

function StackGroup({ title, stack, ...divProps }: StackGroupProps) {
  return (
    <div
      {...divProps}
      className={cn(
        'flex max-w-full view-transition-base flex-col items-center gap-2 overflow-hidden glass-card-dark p-2',
        divProps.className,
      )}
    >
      {title && <p className="text-sm font-semibold text-foreground/80">{title}</p>}
      <div className="inline-flex max-w-full flex-row flex-wrap items-center justify-center gap-2 overflow-hidden">
        {stack.map((tech) => (
          <TechBadge key={tech} tech={tech} className="self-center text-base" />
        ))}
      </div>
    </div>
  )
}
