import type { techStack } from "~/lib/tech-stack"
import { TechStackCategory, techStackInfo } from "~/lib/tech-stack"
import { TechBadge } from "~/components/badges/tech-badge"
import type { ComponentProps } from "react"
import { cn } from "~/lib/utils"

const techStackCategories = Object.values(TechStackCategory)
const DELAY_BASE = 100

export function TechStack() {
  return (
    <div className="size-full min-h-full max-w-full flex flex-col items-stretch justify-center gap-y-16 p-6">
      {techStackCategories.map((category, index, arr) => {
        const delay =
          DELAY_BASE *
          (index +
            arr
              .slice(0, index)
              .reduce(
                (acc, curr) => acc + techStackInfo[curr].stackGroups.length,
                0,
              ))

        return (
          <div key={category} className="flex flex-col gap-4">
            <div
              className="view-transition-base glass-card flex flex-col items-center gap-4"
              style={{
                animationDelay: `${delay}ms`,
              }}
            >
              <h4 className="text-base font-semibold">
                {techStackInfo[category].title}
              </h4>
              <p className="text-sm leading-tight tracking-wide whitespace-pre-wrap text-balance text-center text-[color-mix(in_oklab,_var(--color-foreground)_80%,_var(--color-background))]">
                {techStackInfo[category].description}
              </p>
            </div>
            <div className="grid md:grid-cols-[repeat(auto-fit,_minmax(calc(var(--spacing)*96),1fr))] items-stretch gap-4">
              {techStackInfo[category].stackGroups.map(
                (stackGroup, groupIndex) => (
                  <StackGroup
                    key={stackGroup.title}
                    {...stackGroup}
                    style={{
                      animationDelay: `${delay + (groupIndex + 1) * DELAY_BASE}ms`,
                    }}
                  />
                ),
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

type StackGroupProps = ComponentProps<"div"> & {
  title: string
  stack: Array<keyof typeof techStack>
}

function StackGroup({ title, stack, ...divProps }: StackGroupProps) {
  return (
    <div
      {...divProps}
      className={cn(
        "view-transition-base flex flex-col items-center gap-2 p-2 bg-accent/20 backdrop-blur-sm border rounded-lg overflow-hidden max-w-full",
        divProps.className,
      )}
    >
      {title && (
        <p className="font-semibold text-sm text-foreground/80">{title}</p>
      )}
      <div className="inline-flex flex-row flex-wrap items-center justify-center gap-2 overflow-hidden max-w-full">
        {stack.map((tech) => (
          <TechBadge key={tech} tech={tech} className="text-base self-center" />
        ))}
      </div>
    </div>
  )
}
