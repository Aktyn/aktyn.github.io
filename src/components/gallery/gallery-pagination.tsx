import type { ComponentProps } from "react"
import { cn, clamp } from "~/lib/utils"

type GalleryPaginationProps = {
  count: number
  index: number
} & ComponentProps<"div">

export function GalleryPagination({
  count,
  index,
  ...divProps
}: GalleryPaginationProps) {
  if (!Number.isFinite(count) || count <= 1) {
    return null
  }
  const current = clamp(index, 0, Math.max(0, count - 1))

  return (
    <div
      {...divProps}
      role="group"
      aria-label={`Image ${current + 1} of ${count}`}
      className={cn(
        "inline-flex flex-row items-center gap-1 bg-card border border-muted p-1.5 rounded-full pointer-events-none select-none",
        divProps.className,
      )}
    >
      <span className="sr-only">{`Image ${current + 1} of ${count}`}</span>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            "block rounded-full transition-[background-color,scale] ease-in-out size-1.5",
            i === current
              ? "scale-120 bg-foreground"
              : "scale-100 bg-muted-foreground",
          )}
        />
      ))}
    </div>
  )
}
