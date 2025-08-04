import { ChevronsDown, ChevronsUp, ExternalLink, Github } from "lucide-react"
import { Fragment, useEffect, useRef, useState } from "react"
import { Background } from "./components/background/background"
import { Introduction } from "./components/views/introduction"
import {
  buildSectionVisibilityFactors,
  Navigation,
} from "./components/navigation"
import { SectionView } from "./components/sections/common/section-view"
import { SocialLinks } from "./components/social-links"
import { Button } from "./components/ui/button"
import { ScrollArea } from "./components/ui/scroll-area"
import { Separator } from "./components/ui/separator"
import { isFirefox } from "./lib/consts"
import { SectionType } from "./lib/sections-info"
import { clamp, cn, compareArrays, debounce } from "./lib/utils"

const seeProjectsButtonThreshold = 128

function App() {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const seeProjectsButtonRef = useRef<HTMLButtonElement>(null)

  const [headerMode, setHeaderMode] = useState(false)
  const [sectionVisibilityFactors, setSectionVisibilityFactors] = useState(
    buildSectionVisibilityFactors(),
  )
  const [showBackToTopButton, setShowBackToTopButton] = useState(false)

  useEffect(() => {
    const scrollArea = scrollAreaRef.current?.querySelector(
      "[data-slot=scroll-area-viewport]",
    )
    const nav = navRef.current
    const seeProjectsButton = seeProjectsButtonRef.current

    const sectionContainers = Object.values(SectionType).map((section) =>
      document.getElementById(section),
    )

    if (
      !scrollArea ||
      !nav ||
      !seeProjectsButton ||
      !allElementsFound(sectionContainers)
    ) {
      return
    }

    const update = debounce(
      () => {
        const headerModeThreshold = window.innerHeight / 4
        const sectionVisibilityThreshold = window.innerHeight / 2

        const scrollPosition = scrollArea?.scrollTop

        setHeaderMode(nav.getBoundingClientRect().top < headerModeThreshold)
        setShowBackToTopButton(scrollPosition > window.innerHeight * 2)

        seeProjectsButton.style.opacity = `${Math.max(
          0,
          1 - scrollPosition / seeProjectsButtonThreshold,
        )}`
        seeProjectsButton.style.pointerEvents =
          scrollPosition >= seeProjectsButtonThreshold ? "none" : "auto"

        let offsetY = 0
        const factors: number[] = []
        for (const sectionContainer of sectionContainers) {
          const rect = sectionContainer.getBoundingClientRect()
          const s = scrollPosition - offsetY
          const factor =
            clamp(s / sectionVisibilityThreshold, 0, 1) *
            clamp(
              (rect.height - s + window.innerHeight) /
                sectionVisibilityThreshold,
              0,
              1,
            )
          factors.push(factor)

          offsetY += rect.height
        }

        setSectionVisibilityFactors((prev) => {
          const values = Object.values(prev)
          if (compareArrays(values, factors)) {
            return prev
          }
          return buildSectionVisibilityFactors(factors)
        })
      },
      isFirefox ? 100 : 4,
    )

    update()

    scrollArea.addEventListener("scroll", update)
    return () => {
      scrollArea.removeEventListener("scroll", update)
    }
  }, [])

  // TODO: explain logo (used by me as a signature); perhaps in summary in the bottom of the page (footer-like)

  const scrollToSection = (section: SectionType) => {
    const sectionElement = document.getElementById(section)
    sectionElement?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <Background className="flex flex-col items-center justify-center overflow-hidden">
      <ScrollArea
        ref={scrollAreaRef}
        className="neon-scrollbar w-full h-full text-center *:data-[slot=scroll-area-viewport]:overflow-x-hidden *:data-[slot=scroll-area-viewport]:max-w-screen"
      >
        <Introduction />
        <Navigation
          ref={navRef}
          headerMode={headerMode}
          onSectionLinkClick={scrollToSection}
          sectionVisibilityFactors={sectionVisibilityFactors}
          className="h-12 max-lg:min-xs:h-24"
        />
        <SocialLinks />

        <Button
          ref={seeProjectsButtonRef}
          size="lg"
          variant="outline"
          className="fixed bottom-8 mx-auto left-0 right-0 w-fit flex-col h-auto pt-4 pb-1 rounded-full hover:*:[svg]:translate-y-0 bg-background/25 backdrop-blur-sm shadow-lg hover:bg-background/50 hover:text-primary hover:border-primary hover:shadow-[0_0_calc(var(--spacing)*8)_oklch(var(--primary)/0.25)] transition-[color,border-color,background-color,box-shadow] overflow-hidden animate-in fade-in slide-in-from-bottom delay-800 ease-out fill-mode-both"
          onClick={() => {
            scrollToSection(SectionType.WebDevelopment)
          }}
          onAnimationEnd={(event) =>
            event.currentTarget.classList.remove("delay-800")
          }
        >
          <span className="px-8">Check out some of my projects</span>
          <ChevronsDown className="size-6 -translate-y-1 transition-transform" />
        </Button>
        {Object.values(SectionType).map((section, index) => {
          return (
            <Fragment key={section}>
              {index > 0 && <Separator />}
              <SectionView section={section} />
            </Fragment>
          )
        })}
        <Separator />
        <div className="p-8">
          <Button asChild variant="link" size="sm" className="gap-x-3">
            <a
              href="https://github.com/aktyn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="size-8" />
              There are more projects on my GitHub
              <ExternalLink />
            </a>
          </Button>
        </div>
        <div className="h-[25vh]" />
      </ScrollArea>
      <div
        className={cn(
          "absolute bottom-0 inset-x-0 grid grid-cols-[1fr_auto_auto_auto_1fr] gap-x-2 items-center *:data-[orientation]:bg-foreground/10 *:transition-[background-color,scale] cursor-pointer hover:*:data-[orientation]:bg-primary hover:*:data-[orientation]:scale-x-90 pt-4 bg-linear-to-t from-background to-background/0 *:[svg]:transition-transform hover:*:[svg]:-translate-y-1 transition-[translate,opacity] text-muted-foreground",
          showBackToTopButton
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 translate-y-full",
        )}
        onClick={() => {
          scrollAreaRef.current
            ?.querySelector("[data-slot=scroll-area-viewport]")
            ?.scrollTo({ top: 0, behavior: "smooth" })
        }}
      >
        <Separator />
        <ChevronsUp />
        <span className="text-base font-semibold [text-shadow:0_0_4px_#000]">
          Back to top
        </span>
        <ChevronsUp />
        <Separator />
      </div>
    </Background>
  )
}

export default App

function allElementsFound(
  elements: (HTMLElement | null)[],
): elements is HTMLElement[] {
  return elements.every(Boolean)
}
