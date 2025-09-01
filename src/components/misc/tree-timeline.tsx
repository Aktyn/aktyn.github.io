import { MoveDown, MoveRight } from "lucide-react"
import type { ComponentProps } from "react"
import { type ReactNode } from "react"
import { cn } from "~/lib/utils"
import { Separator } from "../ui/separator"

type TreeTimelineProps = ComponentProps<"div"> & {
  header?: ReactNode
  items: Array<{
    date: string | { start: string; end: string }
    content: ReactNode
  }>
}

export function TreeTimeline({
  header,
  items,
  ...divProps
}: TreeTimelineProps) {
  return (
    <div {...divProps} className={cn("flex flex-col", divProps.className)}>
      {header}
      <Separator className="sm:max-w-64 bg-linear-to-r from-transparent via-foreground/20 sm:via-25% max-sm:via-[calc(var(--spacing)*2)] to-transparent" />
      <div className="flex flex-col">
        <div className="w-32 flex sm:justify-center">
          <span className="w-px h-4 bg-foreground/20 max-sm:ml-2" />
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-row max-sm:flex-wrap items-center justify-stretch gap-0 *:last:flex-0 *:last:grow"
          >
            <div className="w-auto sm:w-32 grid sm:grid-rows-[1fr_auto_1fr] grid-cols-1 items-stretch sm:justify-center self-stretch">
              <span
                className={cn(
                  "sm:mx-auto max-sm:ml-2 w-px min-h-3 max-sm:min-h-6 bg-foreground/20",
                  index === 0 && "max-sm:min-h-0",
                )}
              />
              <div className="w-full text-center text-sm font-semibold text-foreground/60 bg-muted-foreground/10 border border-foreground/20 rounded-md py-0.5 px-2 sm:px-1">
                {typeof item.date === "string" ? (
                  item.date
                ) : (
                  <div className="flex sm:flex-col items-center justify-stretch sm:w-auto max-sm:gap-1">
                    <span>{item.date.start}</span>
                    <MoveDown className="text-muted-foreground size-4 max-sm:hidden" />
                    <MoveRight className="text-muted-foreground size-4 sm:hidden" />
                    <span>{item.date.end}</span>
                  </div>
                )}
              </div>
              <span
                className={cn(
                  "sm:mx-auto max-sm:ml-2 max-sm:min-h-2 max-sm:bg-foreground/20 w-px",
                  index < items.length - 1 && "sm:min-h-3 bg-foreground/20",
                )}
              />
            </div>
            <div className="w-8 h-full mr-3 flex flex-row items-center max-sm:hidden">
              <span className="grow h-px bg-foreground/20" />
              <span className="h-full w-px bg-linear-to-b from-transparent via-foreground/20 to-transparent" />
            </div>
            <div className="max-sm:min-w-[calc(100%-var(--spacing)*2-1px)] sm:my-2 max-sm:ml-2 max-sm:pl-2 max-sm:border-l max-sm:border-foreground/20 text-balance">
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
