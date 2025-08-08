import type { ComponentProps } from "react"
import { cn } from "~/lib/utils"

type GalleryPaginationProps = {
  count: number
  index: number
} & ComponentProps<"div">

export function GalleryPagination({
  count,
  index,
  ...divProps
}: GalleryPaginationProps) {
  return (
    <div
      {...divProps}
      className={cn(
        "inline-block bg-background p-2 rounded-full pointer-events-none",
        divProps.className,
      )}
    >
      {count}, {index}
    </div>
  )
}
