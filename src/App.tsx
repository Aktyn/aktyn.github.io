import { ChevronsDown, ExternalLink, Github } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Background } from "./components/background/background"
import { Navigation } from "./components/navigation"
import { SectionContainer } from "./components/section-container"
import { Button } from "./components/ui/button"
import { ScrollArea } from "./components/ui/scroll-area"
import { Section } from "./lib/consts"

const headerModeThreshold = 32
const seeProjectsButtonThreshold = 128

function App() {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const seeProjectsButtonRef = useRef<HTMLButtonElement>(null)

  //TODO: use resize observer to measure sections height; monitor scroll position to calculate current view in navigation

  const [headerMode, setHeaderMode] = useState(false)

  useEffect(() => {
    const scrollArea = scrollAreaRef.current?.querySelector(
      "[data-slot=scroll-area-viewport]",
    )
    const nav = navRef.current
    const seeProjectsButton = seeProjectsButtonRef.current

    if (!scrollArea || !nav || !seeProjectsButton) {
      return
    }

    const onScroll = () => {
      const scrollPosition = scrollArea?.scrollTop

      setHeaderMode(nav.getBoundingClientRect().top < headerModeThreshold)

      seeProjectsButton.style.opacity = `${Math.max(
        0,
        1 - scrollPosition / seeProjectsButtonThreshold,
      )}`
      seeProjectsButton.style.pointerEvents =
        scrollPosition >= seeProjectsButtonThreshold ? "none" : "auto"
    }

    scrollArea?.addEventListener("scroll", onScroll)

    return () => {
      scrollArea?.removeEventListener("scroll", onScroll)
    }
  }, [])

  // TODO: smart back-to-top button

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
          <h2 className="text-5xl font-black leading-snug tracking-wide">
            Radosław Krajewski
          </h2>
          <h3 className="text-3xl font-medium py-4">Frontend Developer</h3>
        </div>
        <Navigation
          ref={navRef}
          headerMode={headerMode}
          onSectionLinkClick={scrollToSection}
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
              <span className="size-8" />
            </a>
          </Button>
        </div>

        <Button
          ref={seeProjectsButtonRef}
          size="lg"
          variant="outline"
          className="fixed bottom-8 mx-auto left-0 right-0 w-fit flex-col h-auto pt-4 pb-1 rounded-full hover:*:[svg]:translate-y-0 bg-background/25 backdrop-blur-sm hover:bg-background/50 hover:text-primary hover:border-primary transition-colors overflow-hidden"
          onClick={() => {
            scrollToSection(Section.WebDevelopment)
          }}
        >
          <span className="px-8">See some of my projects</span>
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
