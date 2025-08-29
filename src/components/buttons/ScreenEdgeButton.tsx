import { cn } from "~/lib/utils"
import type { ComponentProps } from "react"
import { ChevronDown } from "lucide-react"

export function ScreenEdgeButton({
  children,
  className,
  ...divProps
}: ComponentProps<"div">) {
  return (
    <div
      {...divProps}
      className={cn(
        "view-transition-base flex flex-col items-center justify-self-center cursor-pointer text-muted-foreground hover:text-primary hover:scale-110 transition-[color,scale,opacity] ease-bounce *:animate-bounce *:animation-duration-2000",

        className,
      )}
    >
      <p className="text-xs font-medium">{children}</p>
      <ChevronDown className="size-4 delay-[-100ms]!" />
      <ChevronDown className="size-4 -mt-2 delay-[-300ms]!" />
    </div>
  )
}
