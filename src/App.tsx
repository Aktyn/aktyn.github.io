import { ViewModule } from "~/modules/view.module"
import { Background } from "~/components/background/background"
import { Intro } from "~/components/views/intro"
import type { ComponentProps, UIEventHandler } from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "~/lib/utils"
import { ChevronDown } from "lucide-react"
import { ScrollArea } from "~/components/ui/scroll-area"

export function App() {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef(0)
  const { view, setView } = ViewModule.useView()

  const showNavigation = view !== ViewModule.View.Intro

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
    if (!containerRef.current) {
      return
    }

    const closestView = getClosestView(containerRef.current)

    if (closestView === view) {
      return
    }

    const viewContainer = document.getElementById(`view-${view}`)
    if (viewContainer) {
      viewContainer.scrollIntoView({
        behavior: "smooth",
        block: "center",
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
        <div className="grid grid-cols-[1fr_auto_1fr] grid-rows-[auto] gap-2">
          <aside
            className={cn(
              "bg-blue-500/20 h-dvh sticky top-0 fill-mode-both",
              showNavigation
                ? "animate-in slide-in-from-left"
                : "animate-out slide-out-to-left",
            )}
          >
            TODO - navigation
          </aside>
          <div className="flex flex-col">
            <ViewContainer view={ViewModule.View.PublicProjects}>
              <span>todo - non commercial projects</span>
            </ViewContainer>
            <ViewContainer view={ViewModule.View.MyJourney}>
              <span>
                todo - my journey (write about 3d graphics aspirations, school
                and university, work experience, etc.)
              </span>
            </ViewContainer>
            <ViewContainer view={ViewModule.View.TechStack}>
              <span>
                todo - tech stack; divided into the following groups: groups:
                web development, backend development, databases, known tools
              </span>
            </ViewContainer>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col items-center justify-self-center fixed bottom-2 inset-x-auto cursor-pointer text-muted-foreground hover:text-primary hover:scale-110 transition-[color,scale,opacity] ease-bounce *:animate-bounce *:animation-duration-2000",
            view === ViewModule.View.Intro
              ? "opacity-100 scale-100"
              : "pointer-events-none opacity-0 scale-0",
          )}
          onClick={() => setView(ViewModule.View.PublicProjects)}
        >
          <p className="text-xs font-medium">Scroll for more</p>
          <ChevronDown className="size-4 delay-[-100ms]!" />
          <ChevronDown className="size-4 -mt-2 delay-[-300ms]!" />
        </div>
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
  const { view: currentView } = ViewModule.useView()
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

  return (
    // Mask is breaking backdrop-blur of child elements
    // **:data-[slot=scroll-area-viewport]:mask-t-from-[calc(100%-var(--spacing)*10)] **:data-[slot=scroll-area-viewport]:mask-b-from-[calc(100%-var(--spacing)*10)]
    <ScrollArea className="snap-start size-full min-h-dvh overflow-hidden **:data-[slot=scroll-area-viewport]:*:min-h-full **:data-[slot=scroll-area-viewport]:*:max-w-full **:data-[slot=scroll-area-viewport]:*:grid!">
      <div
        {...divProps}
        id={`view-${view}`}
        data-current={current}
        className={cn(
          "size-full max-w-full overflow-hidden flex flex-col items-center justify-center",
          className,
        )}
      >
        {mounted && children}
      </div>
    </ScrollArea>
  )
}
