import { cn } from "~/lib/utils"
import { techStack } from "~/lib/tech-stack"
import { Badge } from "~/components/ui/badge"
import type { ComponentProps } from "react"

type TechBadgeProps = { tech: keyof typeof techStack } & ComponentProps<
  typeof Badge
>

export function TechBadge({ tech, ...badgeProps }: TechBadgeProps) {
  return (
    <Badge
      dir="ltr"
      variant="outline"
      {...badgeProps}
      className={cn(
        "text-sm gap-x-2 p-1 px-2 rounded-md bg-background/50 relative",
        badgeProps.className,
      )}
    >
      {techStack[tech].icon && (
        <>
          <i
            className={cn(
              techStack[tech].icon,
              "absolute left-2 inset-y-auto blur-md",
            )}
          />
          <i
            className={cn(
              techStack[tech].icon,
              "drop-shadow-[0_0_calc(var(--spacing)*0.5)_#000]",
            )}
          />
        </>
      )}
      <span className="leading-none">{techStack[tech].name}</span>
    </Badge>
  )
}
