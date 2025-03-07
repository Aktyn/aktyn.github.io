import { cn } from "~/lib/utils"

type SlashSeparatorProps = {
  straight?: boolean
  className?: string
}

export function SlashSeparator({
  straight = false,
  className,
}: SlashSeparatorProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        "size-6 opacity-25 transition-transform duration-500",
        straight ? "rotate-0" : "rotate-15",
        className,
      )}
    >
      <line
        x1="12"
        y1="0"
        x2="12"
        y2="24"
        stroke="var(--foreground)"
        strokeWidth={2}
      />
    </svg>
  )
}
