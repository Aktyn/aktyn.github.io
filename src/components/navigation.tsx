import { CircleEllipsis } from "lucide-react"
import { Fragment, PropsWithChildren, RefObject } from "react"
import { Section } from "~/lib/consts"
import { cn } from "~/lib/utils"
import { SlashSeparator } from "./common/slash-separator"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"

type NavigationProps = {
  ref: RefObject<HTMLDivElement | null>
  headerMode: boolean
  onSectionLinkClick: (section: Section) => void
  className?: string
}

export function Navigation({
  ref,
  headerMode,
  onSectionLinkClick,
  className,
}: NavigationProps) {
  return (
    <nav
      ref={ref}
      role="navigation"
      className={cn(
        "z-10 mx-auto w-fit sticky top-2 px-8 border rounded-full border-transparent bg-background/0 transition-colors duration-500",
        headerMode && "border-border bg-background/50 backdrop-blur-sm",
        className,
      )}
    >
      <ScrollArea className="h-full **:data-[radix-scroll-area-viewport]:*:h-full">
        <div className="inline-grid grid-cols-[1fr_auto_1fr_auto_1fr] justify-center items-center text-center *:not-[svg]:flex-1 whitespace-nowrap gap-x-2 h-full">
          {Object.values(Section).map((section, index) => (
            <Fragment key={section}>
              {index > 0 && <SlashSeparator straight={headerMode} />}
              <SectionLink onClick={() => onSectionLinkClick(section)}>
                {section}
              </SectionLink>
            </Fragment>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </nav>
  )
}

type SectionLinkProps = PropsWithChildren<{
  onClick: () => void
}>

function SectionLink({ children, onClick }: SectionLinkProps) {
  return (
    <p
      className="h-full overflow-hidden flex flex-col items-center justify-center gap-x-2 cursor-pointer *:transition-[translate,opacity] hover:*:first:-translate-y-2 hover:*:last:-translate-y-3 hover:*:last:opacity-100"
      role="link"
      onClick={onClick}
    >
      <span>{children}</span>
      <div className="flex flex-row items-start gap-x-2 font-light text-sm h-0 translate-y-2 opacity-0 text-primary">
        <CircleEllipsis className="size-5" />
        Show more
      </div>
    </p>
  )
}
