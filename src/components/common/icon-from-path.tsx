import { type ComponentProps } from "react"
import { cn } from "~/lib/utils"

type IconFromPathProps = ComponentProps<"svg"> & {
  d: string
}

export function IconFromPath({ d, ...svgProps }: IconFromPathProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth={1}
      {...svgProps}
      className={cn("size-6 stroke-foreground", svgProps.className)}
    >
      <path d={d} />
    </svg>
  )
}
