import { differenceInYears, format } from "date-fns"
import { CalendarRange, ChevronsDown, ExternalLink, Github } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Background } from "./components/background/background"
import {
  buildSectionVisibilityFactors,
  Navigation,
} from "./components/navigation"
import { SectionContainer } from "./components/section-container"
import { Button } from "./components/ui/button"
import { ScrollArea } from "./components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./components/ui/tooltip"
import { Section } from "./lib/consts"
import { clamp, compareArrays } from "./lib/utils"

const seeProjectsButtonThreshold = 128
const experienceStartDate = new Date("2019-10-10")
const fullName = "Radosław Krajewski"

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

    const sectionContainers = Object.values(Section).map((section) =>
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

    //TODO: consider debouncing the update function and animating dynamic values in the UI
    const update = () => {
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
            (rect.height - s + window.innerHeight) / sectionVisibilityThreshold,
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
    }

    update()

    scrollArea.addEventListener("scroll", update)
    return () => {
      scrollArea.removeEventListener("scroll", update)
    }
  }, [])

  // TODO: smart back-to-top button
  // TODO: explain logo (used by me as a signature)

  const scrollToSection = (section: Section) => {
    const sectionElement = document.getElementById(section)
    sectionElement?.scrollIntoView({
      behavior: "smooth",
    })
  }

  return (
    <Background className="flex flex-col items-center justify-center">
      <ScrollArea ref={scrollAreaRef} className="w-full h-full text-center">
        <div className="min-h-[calc(50dvh-var(--spacing)*6)] flex flex-col justify-end items-center gap-y-2 pb-4">
          {/* TODO: scroll based animation for exiting text from the viewport */}
          <div className="relative *:text-5xl *:font-black *:leading-snug *:tracking-wide *:not-last:absolute *:not-last:inset-0 *:not-last:select-none *:not-last:pointer-events-none">
            <div className="bg-linear-90 from-[oklch(63.92%_0.2104_5.28)] to-[oklch(84.33%_0.1606_165.37)] bg-clip-text text-transparent blur-2xl -z-1 opacity-50">
              {fullName}
            </div>
            <h2 className="text-white drop-shadow-[0_0_calc(var(--spacing)*0.5)_#0008]">
              {fullName}
            </h2>
          </div>
          <h3 className="text-3xl font-medium pt-4">Frontend Developer</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-x-2">
                <CalendarRange className="size-5" />
                {differenceInYears(new Date(), experienceStartDate)} years of
                experience
              </p>
            </TooltipTrigger>
            <TooltipContent className="text-sm">
              <b>{format(experienceStartDate, "dd.MM.yyyy")}</b> till now
            </TooltipContent>
          </Tooltip>
          {/* TODO: button that opens popup or modal with my experience timeline */}
        </div>
        <Navigation
          ref={navRef}
          headerMode={headerMode}
          onSectionLinkClick={scrollToSection}
          sectionVisibilityFactors={sectionVisibilityFactors}
          className="h-12"
        />
        <div className="min-h-[calc(50dvh-var(--spacing)*6)] flex flex-row items-start justify-center pt-4">
          <Button asChild variant="link" size="sm" className="gap-x-3">
            <a
              href="https://github.com/aktyn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="size-8" />
              See more on my GitHub
              <ExternalLink />
            </a>
          </Button>
          <span className="size-8" />
        </div>

        <Button
          ref={seeProjectsButtonRef}
          size="lg"
          variant="outline"
          className="fixed bottom-8 mx-auto left-0 right-0 w-fit flex-col h-auto pt-4 pb-1 rounded-full hover:*:[svg]:translate-y-0 bg-background/25 backdrop-blur-sm shadow-lg hover:bg-background/50 hover:text-primary hover:border-primary hover:shadow-[0_0_calc(var(--spacing)*8)_oklch(var(--primary)/0.25)] transition-[color,border-color,background-color,box-shadow] overflow-hidden"
          onClick={() => {
            scrollToSection(Section.WebDevelopment)
          }}
        >
          <span className="px-8">Check out some of my projects</span>
          <ChevronsDown className="size-6 -translate-y-1 transition-transform" />
        </Button>
        <SectionContainer section={Section.WebDevelopment}>
          TODO
        </SectionContainer>
        <SectionContainer section={Section.GameDevelopment}>
          TODO
        </SectionContainer>
        <SectionContainer section={Section.ComputerGraphics}>
          TODO
        </SectionContainer>
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
