import type { PropsWithChildren } from "react"
import { Section } from "~/lib/consts"

type SectionContainerProps = PropsWithChildren<{
  section: Section
}>

export function SectionContainer({ children, section }: SectionContainerProps) {
  return (
    <section
      id={section}
      className="min-h-128 w-full flex items-center justify-center bg-background/50"
    >
      {children}
    </section>
  )
}
