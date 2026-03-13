import { cn } from '~/lib/utils'
import { techStack } from '~/lib/tech-stack'
import type { ComponentProps } from 'react'
import { Badge } from '../common/badge'

type TechBadgeProps = { tech: keyof typeof techStack } & ComponentProps<typeof Badge>

export function TechBadge({ tech, ...badgeProps }: TechBadgeProps) {
  return (
    <Badge
      // dir="ltr"
      // variant="outline"
      {...badgeProps}
      className={cn(
        'relative gap-x-2 rounded-md bg-background/50 p-1 px-2 text-sm',
        badgeProps.className,
      )}
    >
      {techStack[tech].icon && (
        <>
          <i className={cn(techStack[tech].icon, 'absolute inset-y-auto left-2 blur-md')} />
          <i
            className={cn(techStack[tech].icon, 'drop-shadow-[0_0_calc(var(--spacing)*0.5)_#000]')}
          />
        </>
      )}
      <span className="leading-none">{techStack[tech].name}</span>
    </Badge>
  )
}
