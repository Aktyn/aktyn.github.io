import { type PropsWithChildren } from "react"
import { createPortal } from "react-dom"

type RootPortalProps = PropsWithChildren

export function RootPortal({ children }: RootPortalProps) {
  const root = document.getElementById("root") || document.body

  if (!root) {
    return children
  }

  return createPortal(children, root)
}
