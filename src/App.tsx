import { ChevronsDown, ExternalLink } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Background } from "./components/background/background"
import { SlashSeparator } from "./components/common/slash-separator"
import { Button } from "./components/ui/button"
import { ScrollArea } from "./components/ui/scroll-area"
import { cn } from "./lib/utils"

const headerModeThreshold = 32
const seeProjectsButtonThreshold = 128

function App() {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const seeProjectsButtonRef = useRef<HTMLButtonElement>(null)
  const firstSectionRef = useRef<HTMLDivElement>(null)

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

  return (
    <Background className="flex flex-col items-center justify-center">
      <ScrollArea ref={scrollAreaRef} className="w-full h-full">
        <main className="grid grid-cols-1 grid-rows-[1fr_auto_auto_auto_auto_3fr] items-center justify-center w-full p-4 sm:p-8 text-center min-h-screen">
          <span />
          <h2 className="text-5xl font-black leading-snug tracking-wide">
            Radosław Krajewski
          </h2>
          <h3 className="text-3xl font-medium my-4">Frontend Developer</h3>
          <nav
            ref={navRef}
            className={cn(
              "z-10 mx-auto inline-grid grid-cols-[1fr_auto_1fr_auto_1fr] max-sm:grid-cols-1 justify-center items-center text-center *:not-[svg]:flex-1 whitespace-nowrap gap-x-2 py-2 mt-6 mb-2 sticky top-2 px-8 border rounded-full border-transparent bg-background/0 transition-colors duration-500",
              //TODO: animate backdrop-blur-sm
              headerMode && "border-border bg-background/50",
            )}
          >
            <p>Web development</p>
            <SlashSeparator straight={headerMode} className="max-sm:hidden" />
            <p>Game development</p>
            <SlashSeparator straight={headerMode} className="max-sm:hidden" />
            <p>Computer graphics</p>
          </nav>
          <div className="flex flex-row items-center justify-center gap-x-2 mt-2">
            {/* TODO: animate link button bottom border */}
            <Button asChild variant="link">
              <a
                href="https://github.com/aktyn"
                target="_blank"
                rel="noopener noreferrer"
              >
                See more on my GitHub
                <ExternalLink />
              </a>
            </Button>
          </div>
          <span />
          <Button
            ref={seeProjectsButtonRef}
            size="lg"
            variant="outline"
            className="fixed bottom-8 mx-auto left-0 right-0 w-fit flex-col h-auto pt-4 pb-1 rounded-full hover:*:[svg]:translate-y-0 bg-background/25 backdrop-blur-sm hover:bg-background/50 hover:text-primary hover:border-primary transition-colors overflow-hidden"
            onClick={() => {
              firstSectionRef.current?.scrollIntoView({
                behavior: "smooth",
              })
            }}
          >
            <span className="px-8">See some of my projects</span>
            <ChevronsDown className="size-6 -translate-y-1 transition-transform" />
          </Button>
        </main>
        <section
          ref={firstSectionRef}
          className="min-h-128 w-full flex items-center justify-center bg-background/50"
        >
          TODO
        </section>
      </ScrollArea>
    </Background>
  )
}

export default App
