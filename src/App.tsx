import { ViewModule } from "~/modules/view.module"
import { Background } from "~/components/background/background"
import { Intro } from "~/components/views/intro"
import type { ComponentProps, UIEventHandler } from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "~/lib/utils"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Navigation } from "./components/navigation"
import { Projects } from "~/components/views/projects"
import { ScreenEdgeButton } from "~/components/buttons/ScreenEdgeButton"

export function App() {
  const firstEffectRef = useRef(true)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef(0)
  const { view, setView } = ViewModule.useView()

  const handleScroll: UIEventHandler<HTMLDivElement> = (event) => {
    const closestView = getClosestView(event.currentTarget)

    const scrollTop = event.currentTarget.scrollTop

    // const bg =
    //   backgroundRef.current?.querySelector<HTMLDivElement>(":first-child")
    // if (bg) {
    //   const rotation =
    //     ((scrollTop / event.currentTarget.clientHeight) * 30) % 360
    //   console.log("rotation:", rotation)
    //   bg.style.filter = `hue-rotate(${360 - rotation}deg)`
    // }

    if (view !== closestView) {
      const viewsChangeDirection = Math.sign(
        ViewModule.ViewsArray.indexOf(closestView) -
          ViewModule.ViewsArray.indexOf(view),
      )
      const scrollChangeDirection = Math.sign(scrollTop - lastScrollTop.current)
      if (viewsChangeDirection === scrollChangeDirection) {
        setView(closestView)
      }
    }

    lastScrollTop.current = scrollTop
  }

  useEffect(() => {
    const handleHashChange = (event: HashChangeEvent) => {
      const hash = new URL(event.newURL).hash

      const viewFromHash =
        ((hash.replace(/^#(.*)/, "$1") ??
          "") as keyof typeof ViewModule.viewData) || ViewModule.View.Intro

      if (ViewModule.ViewsArray.includes(viewFromHash)) {
        setView(viewFromHash)
      }
    }

    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [setView])

  useEffect(() => {
    const firstEffect = firstEffectRef.current
    firstEffectRef.current = false

    if (!containerRef.current) {
      return
    }

    if (view !== ViewModule.View.Intro) {
      window.location.hash = `#${view}`
    } else {
      const noHashURL = window.location.href.replace(/#.*$/, "")
      window.history.pushState("", document.title, noHashURL)
    }

    const closestView = getClosestView(containerRef.current)

    if (closestView === view) {
      return
    }

    const viewContainer = document.getElementById(`view-${view}`)
    if (viewContainer) {
      viewContainer.scrollIntoView({
        behavior: firstEffect ? "instant" : "smooth",
        block: "start",
      })
    }
  }, [view])

  return (
    <Background ref={backgroundRef}>
      <div
        ref={containerRef}
        className="w-dvw h-dvh overflow-y-scroll no-scrollbar scroll-smooth snap-y snap-mandatory"
        onScroll={handleScroll}
      >
        <ViewContainer view={ViewModule.View.Intro}>
          <Intro />
        </ViewContainer>
        <div className="grid grid-cols-1 xl:grid-cols-[calc(var(--spacing)*64)_auto] 2xl:grid-cols-[calc(var(--spacing)*64)_auto_calc(var(--spacing)*64)] gap-2">
          <Navigation mainContainerRef={containerRef} />
          <div className="flex flex-col">
            <ViewContainer view={ViewModule.View.PublicProjects}>
              <Projects />
            </ViewContainer>
            <ViewContainer view={ViewModule.View.MyJourney}>
              <span>
                My journey, 3d graphics aspirations, school, university and work
                experience
                <br />
                Coming soon...
              </span>
            </ViewContainer>
            <ViewContainer view={ViewModule.View.TechStack}>
              <span>
                Tech stack divided into web development, backend development,
                databases and known tools
                <br />
                Coming soon...
              </span>
            </ViewContainer>
          </div>
        </div>

        <ScreenEdgeButton
          className={cn(
            "fixed bottom-2 inset-x-auto",
            view === ViewModule.View.Intro
              ? "opacity-100 scale-100"
              : "pointer-events-none opacity-0 scale-0",
          )}
          onClick={() => setView(ViewModule.View.PublicProjects)}
        >
          Scroll for more
        </ScreenEdgeButton>
      </div>
    </Background>
  )
}

function getClosestView(container: HTMLDivElement) {
  const viewPosition = Math.round(container.scrollTop / container.clientHeight)
  return ViewModule.ViewsArray[viewPosition] ?? ViewModule.ViewsArray[0]
}

type ViewContainerProps = ComponentProps<"div"> & {
  view: ViewModule.View
}

function ViewContainer({
  view,
  children,
  className,
  ...divProps
}: ViewContainerProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { view: currentView, viewChangeDirection } = ViewModule.useView()
  const current = view === currentView

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (current) {
      setMounted(true)
      return
    }

    const unmountTimeout = setTimeout(() => {
      setMounted(false)
    }, 800)

    return () => clearTimeout(unmountTimeout)
  }, [current])

  useEffect(() => {
    if (!current || !mounted || viewChangeDirection !== -1) {
      return
    }

    const scrollArea = scrollAreaRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    )

    if (scrollArea) {
      scrollArea.scrollTo({
        top: scrollArea.scrollHeight,
        behavior: "instant",
      })
    }
  }, [current, mounted, viewChangeDirection])

  return (
    // Mask is breaking backdrop-blur of child elements
    // **:data-[slot=scroll-area-viewport]:mask-t-from-[calc(100%-var(--spacing)*10)] **:data-[slot=scroll-area-viewport]:mask-b-from-[calc(100%-var(--spacing)*10)]
    <ScrollArea
      ref={scrollAreaRef}
      id={`view-${view}`}
      data-view={view}
      className="snap-start size-full h-dvh overflow-hidden **:data-[slot=scroll-area-viewport]:*:min-h-full **:data-[slot=scroll-area-viewport]:*:max-w-full **:data-[slot=scroll-area-viewport]:*:grid!"
    >
      <div
        {...divProps}
        data-current={current}
        className={cn(
          "size-full max-w-full *:max-w-7xl overflow-hidden flex flex-col items-center justify-center",
          className,
        )}
      >
        {mounted && children}
      </div>
    </ScrollArea>
  )
}
