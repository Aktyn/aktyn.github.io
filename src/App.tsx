import { ChevronsDown } from "lucide-react"
import { Fragment, useEffect, useRef, useState } from "react"
import { Background } from "./components/background/background"
import { Introduction } from "./components/introduction"
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
import { clamp, compareArrays, debounce } from "./lib/utils"

const seeProjectsButtonThreshold = 128

function App() {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const seeProjectsButtonRef = useRef<HTMLButtonElement>(null)

  const [headerMode, setHeaderMode] = useState(false)
  const [sectionVisibilityFactors, setSectionVisibilityFactors] = useState(
    buildSectionVisibilityFactors(),
  )

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

  // TODO: smart back-to-top button
  // TODO: explain logo (used by me as a signature); perhaps in summary in the bottom of the page (footer-like)

  const scrollToSection = (section: SectionType) => {
    const sectionElement = document.getElementById(section)
    sectionElement?.scrollIntoView({
      behavior: "smooth",
    })
  }

  return (
    <Background className="flex flex-col items-center justify-center">
      <ScrollArea ref={scrollAreaRef} className="w-full h-full text-center">
        <Introduction />
        <Navigation
          ref={navRef}
          headerMode={headerMode}
          onSectionLinkClick={scrollToSection}
          sectionVisibilityFactors={sectionVisibilityFactors}
          className="h-12 max-sm:h-46 max-lg:h-24"
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
      </ScrollArea>
    </Background>
  )
}

export default App

function allElementsFound(
  elements: (HTMLElement | null)[],
): elements is HTMLElement[] {
  return elements.every(Boolean)
}
