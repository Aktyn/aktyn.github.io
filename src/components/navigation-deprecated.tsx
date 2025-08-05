import { Forward } from "lucide-react"
import { DynamicIcon } from "lucide-react/dynamic"
import { Fragment, type RefObject } from "react"
import { Sections, SectionType } from "~/lib/sections-info"
import { cn } from "~/lib/utils"
import { IconFromPath } from "./common/icon-from-path"
import { SlashSeparator } from "./common/slash-separator"
import { ScrollArea } from "./ui/scroll-area"

import "./navigation.css"

type NavigationProps = {
  ref: RefObject<HTMLDivElement | null>
  headerMode: boolean
  onSectionLinkClick: (section: SectionType) => void
  sectionVisibilityFactors: ReturnType<typeof buildSectionVisibilityFactors>
  className?: string
}

export function NavigationDeprecated({
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
        "navigation-container z-30 mx-auto w-fit sticky top-2 border rounded-full max-lg:min-xs:rounded-xl border-transparent bg-background/0 transition-colors duration-500",
        headerMode && "border-border bg-background/50 backdrop-blur-sm",
        className,
      )}
    >
      <ScrollArea className="h-full **:data-[radix-scroll-area-viewport]:*:h-full **:data-[radix-scroll-area-viewport]:*:grid!">
        <div className="inline-grid grid-cols-[repeat(3,1fr_auto)_1fr] max-lg:min-xs:grid-cols-[1fr_auto_1fr] max-lg:min-xs:*:[svg]:nth-[4n]:hidden justify-center items-center text-center xs:*:not-[svg]:flex-1 whitespace-nowrap gap-x-2 gap-y-6 h-full overflow-y-hidden rounded-full px-8 max-lg:min-xs:pb-3">
          {Object.values(SectionType).map((section, index) => (
            <Fragment key={section}>
              {index > 0 && <SlashSeparator straight={headerMode} />}
              <SectionLink
                section={section}
                sectionVisibilityFactor={sectionVisibilityFactors[section]}
                headerMode={headerMode}
                onClick={() => onSectionLinkClick(section)}
              />
            </Fragment>
          ))}
        </div>
      </ScrollArea>
    </nav>
  )
}

type SectionLinkProps = {
  section: SectionType
  sectionVisibilityFactor: number
  headerMode: boolean
  onClick: () => void
}

function SectionLink({
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
          "absolute inset-0 m-auto -mb-3 bg-white rounded-xs h-4 max-lg:h-1 pointer-events-none",
          section === SectionType.WebDevelopment &&
            "drop-shadow-[0_0_calc(var(--spacing)*7)_oklch(var(--blue-400))]",
          section === SectionType.GameDevelopment &&
            headerMode &&
            "drop-shadow-[0_0_calc(var(--spacing)*7)_oklch(var(--red-400))]",
          section === SectionType.ComputerGraphics &&
            headerMode &&
            "drop-shadow-[0_0_calc(var(--spacing)*7)_oklch(var(--green-400))]",
          section === SectionType.RaspberryPi &&
            headerMode &&
            "drop-shadow-[0_0_calc(var(--spacing)*7)_oklch(var(--yellow-400))]",
        )}
        style={{
          width: `${sectionVisibilityFactor * 100}%`,
          opacity: Math.pow(Math.max(sectionVisibilityFactor, 0), 0.25),
          transition: "width 0.2s linear, opacity 0.2s linear",
        }}
      />
      <span className="z-1 drop-shadow-[0_0_2px_#0008] flex flex-row items-center gap-x-2">
        {typeof Sections[section].icon === "string" ? (
          <DynamicIcon
            name={Sections[section].icon}
            className="size-5 inline"
          />
        ) : (
          <IconFromPath
            d={Sections[section].icon.svgPath}
            viewBox="0 0 50 50"
            className="size-5 inline"
          />
        )}
        <span className="max-xs:hidden">{Sections[section].title}</span>
      </span>
      <div className="max-xs:hidden z-2 flex flex-row items-start gap-x-2 font-light text-sm h-0 translate-y-2 opacity-0 text-primary">
        <Forward className="size-5" />
        Show more
      </div>
    </div>
  )
}

export function buildSectionVisibilityFactors(factors?: number[]) {
  return Object.values(SectionType).reduce(
    (acc, section, index) => {
      acc[section] = factors?.[index] ?? 0
      return acc
    },
    {} as { [key in SectionType]: number },
  )
}
