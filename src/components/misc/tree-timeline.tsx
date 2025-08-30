import { MoveDown } from "lucide-react"
import { type ReactNode } from "react"
import { cn } from "~/lib/utils"
import { Separator } from "../ui/separator"

type TreeTimelineProps = {
  header?: ReactNode
  items: Array<{
    date: string | { start: string; end: string }
    content: ReactNode
  }>
}

export function TreeTimeline({ header, items }: TreeTimelineProps) {
  return (
    <div className="flex flex-col">
      {header}
      <Separator className="max-w-64 bg-linear-to-r from-transparent via-foreground/20 via-25% to-transparent" />
      <div className="flex flex-col">
        <div className="w-32 flex justify-center">
          <span className="w-px h-4 bg-foreground/20" />
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-stretch gap-0 *:last:flex-0 *:last:grow"
          >
            <div className="w-32 grid grid-rows-[1fr_auto_1fr] grid-cols-1 items-stretch justify-center self-stretch">
              <span className="mx-auto w-px min-h-3 bg-foreground/20" />
              <div className="w-full text-center text-sm font-semibold text-foreground/60 bg-muted-foreground/10 border border-foreground/20 rounded-md py-0.5 px-1">
                {typeof item.date === "string" ? (
                  item.date
                ) : (
                  <div className="flex flex-col items-center">
                    <span>{item.date.start}</span>
                    <MoveDown className="text-muted-foreground size-4" />
                    <span>{item.date.end}</span>
                  </div>
                )}
              </div>
              <span
                className={cn(
                  "mx-auto",
                  index < items.length - 1 && "w-px min-h-3 bg-foreground/20",
                )}
              />
            </div>
            <div className="w-8 h-full mr-3 flex flex-row items-center">
              <span className="grow h-px bg-foreground/20" />
              <span className="h-full w-px bg-linear-to-b from-transparent via-foreground/20 to-transparent" />
            </div>
            <div className="my-2 text-balance">{item.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
