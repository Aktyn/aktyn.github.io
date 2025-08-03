import { ViewModule } from "~/modules/view.module.tsx"
import { Background } from "~/components/background/background.tsx"
import { Intro } from "~/components/views/intro.tsx"
import type { ComponentProps, UIEventHandler } from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "~/lib/utils.ts"

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
        ViewsArray.indexOf(closestView) - ViewsArray.indexOf(view),
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
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2">
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
              <span>todo - no commercial projects</span>
            </ViewContainer>
            <ViewContainer view={ViewModule.View.MyJourney}>
              <span>todo - my journey</span>
            </ViewContainer>
            <ViewContainer view={ViewModule.View.TechStack}>
              <span>todo - tech stack</span>
            </ViewContainer>
          </div>
        </div>
      </div>
    </Background>
  )
}

const ViewsArray = Object.values(ViewModule.View)

function getClosestView(container: HTMLDivElement) {
  const viewPosition = Math.round(container.scrollTop / container.clientHeight)
  return ViewsArray[viewPosition] ?? ViewsArray[0]
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
    }, 1000)

    return () => clearTimeout(unmountTimeout)
  }, [current])

  return (
    <div
      {...divProps}
      id={`view-${view}`}
      data-current={current}
      className={cn(
        "size-full h-dvh flex flex-col items-center justify-center snap-start",
        className,
      )}
    >
      {mounted && children}
    </div>
  )
}
