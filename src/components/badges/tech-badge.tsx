import { cn } from '~/lib/utils'
import { techStack } from '~/lib/tech-stack'
import type { ComponentProps } from 'react'
import { Badge } from '../common/badge'

type TechBadgeProps = { tech: keyof typeof techStack } & ComponentProps<typeof Badge>

export function TechBadge({ tech, ...badgeProps }: TechBadgeProps) {
  return (
    <Badge
      dir="ltr"
      {...badgeProps}
      className={cn(
        'relative flex flex-row gap-x-2 rounded-md bg-background/50 text-sm text-shadow-none not-print:p-1 not-print:px-2 print:border-none',
        badgeProps.className,
      )}
    >
      {techStack[tech].icon && (
        <>
          <i
            className={cn(
              techStack[tech].icon,
              'absolute inset-y-auto left-2 blur-md brightness-150 saturate-150 print:hidden',
            )}
          />
          <i
            className={cn(
              techStack[tech].icon,
              'not-print:drop-shadow-[0_0_calc(var(--spacing)*1)_var(--color-background)] print:brightness-0',
            )}
          />
        </>
      )}
      <span className="leading-none">{techStack[tech].name}</span>
    </Badge>
  )
}
