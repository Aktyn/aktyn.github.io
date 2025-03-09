import { Forward } from "lucide-react"
import { Fragment, PropsWithChildren, RefObject } from "react"
import { Section } from "~/lib/consts"
import { cn } from "~/lib/utils"
import { SlashSeparator } from "./common/slash-separator"
import { ScrollArea } from "./ui/scroll-area"

import "./navigation.css"

type NavigationProps = {
  ref: RefObject<HTMLDivElement | null>
  headerMode: boolean
  onSectionLinkClick: (section: Section) => void
  sectionVisibilityFactors: ReturnType<typeof buildSectionVisibilityFactors>
  className?: string
}

export function Navigation({
  ref,
  headerMode,
  onSectionLinkClick,
  sectionVisibilityFactors,
  className,
}: NavigationProps) {
  return (
    <nav
      ref={ref}
      role="navigation"
      className={cn(
        "navigation-container z-30 mx-auto w-fit sticky top-2 border rounded-full max-sm:rounded-xl border-transparent bg-background/0 transition-colors duration-500",
        headerMode && "border-border bg-background/50 backdrop-blur-sm",
        className,
      )}
    >
      <ScrollArea className="h-full **:data-[radix-scroll-area-viewport]:*:h-full **:data-[radix-scroll-area-viewport]:*:grid!">
        <div className="inline-grid grid-cols-[1fr_auto_1fr_auto_1fr] max-sm:grid-cols-1 justify-center items-center text-center *:not-[svg]:flex-1 whitespace-nowrap gap-x-2 gap-y-6 h-full overflow-y-hidden rounded-full max-sm:rounded-xl px-8 max-sm:pb-3 max-sm:*:[svg]:hidden">
          {Object.values(Section).map((section, index) => (
            <Fragment key={section}>
              {index > 0 && <SlashSeparator straight={headerMode} />}
              <SectionLink
                section={section}
                sectionVisibilityFactor={sectionVisibilityFactors[section]}
                headerMode={headerMode}
                onClick={() => onSectionLinkClick(section)}
              >
                {section}
              </SectionLink>
            </Fragment>
          ))}
        </div>
      </ScrollArea>
    </nav>
  )
}

type SectionLinkProps = PropsWithChildren<{
  section: Section
  sectionVisibilityFactor: number
  headerMode: boolean
  onClick: () => void
}>

function SectionLink({
  children,
  section,
  sectionVisibilityFactor,
  headerMode,
  onClick,
}: SectionLinkProps) {
  return (
    <div
      className={cn(
        "h-full flex flex-col items-center justify-center gap-x-2 cursor-pointer *:transition-[translate,opacity] relative",
        sectionVisibilityFactor < 0.25 &&
          "hover:*:first-of-type:[span]:-translate-y-2 hover:*:last:-translate-y-3 hover:*:last:opacity-100",
      )}
      role="link"
      onClick={onClick}
    >
      <div
        className={cn(
          "absolute inset-0 m-auto -mb-3 bg-white rounded-xs h-4 pointer-events-none",
          section === Section.WebDevelopment &&
            "drop-shadow-[0_0_calc(var(--spacing)*7)_oklch(var(--blue-400))]",
          section === Section.GameDevelopment &&
            headerMode &&
            "drop-shadow-[0_0_calc(var(--spacing)*7)_oklch(var(--red-400))]",
          section === Section.ComputerGraphics &&
            headerMode &&
            "drop-shadow-[0_0_calc(var(--spacing)*7)_oklch(var(--green-400))]",
        )}
        style={{
          width: `${sectionVisibilityFactor * 100}%`,
          opacity: Math.pow(Math.max(sectionVisibilityFactor, 0), 0.25),
          transition: "width 0.2s linear, opacity 0.2s linear",
        }}
      />
      <span className="z-1 drop-shadow-[0_0_2px_#0008]">{children}</span>
      <div className="z-2 flex flex-row items-start gap-x-2 font-light text-sm h-0 translate-y-2 opacity-0 text-primary">
        <Forward className="size-5" />
        Show more
      </div>
    </div>
  )
}

export function buildSectionVisibilityFactors(factors?: number[]) {
  return Object.values(Section).reduce(
    (acc, section, index) => {
      acc[section] = factors?.[index] ?? 0
      return acc
    },
    {} as { [key in Section]: number },
  )
}
