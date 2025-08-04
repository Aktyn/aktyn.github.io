import type { ComponentProps } from "react"
import { cn } from "~/lib/utils"

import "./shining-text.css"

type ShiningTextProps = ComponentProps<"div"> & {
  component?: string
}

export function ShiningText({
  component: Component = "div",
  ...divProps
}: ShiningTextProps) {
  const props = {
    ...divProps,
    className: cn("shining-text", divProps.className),
  }

  return <Component {...props} />
}
