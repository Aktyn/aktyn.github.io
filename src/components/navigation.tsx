import { clamp, cn } from "~/lib/utils"
import { ViewModule } from "~/modules/view.module"
import { ScrollArea } from "~/components/ui/scroll-area"
import {
  ArrowUpToLine,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import type { RefObject } from "react"
import {
  type ComponentProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { ProjectsGroup, projectsGroupsInfo } from "~/lib/projects-info"
import { journeyInfo, JourneySection } from "~/lib/journey-info"
import { TechStackCategory, techStackInfo } from "~/lib/tech-stack"
import { DynamicIcon } from "lucide-react/dynamic"
import { IconFromPath } from "~/components/common/icon-from-path"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"

const delayStep = 50

type NavigationProps = {
  mainContainerRef: RefObject<HTMLDivElement | null>
}

export function Navigation({ mainContainerRef }: NavigationProps) {
  const { view, setView } = ViewModule.useView()
  const enableNavigation = view !== ViewModule.View.Intro

  const navigationContainerRef = useRef<HTMLDivElement>(null)

  const [showSidebar, setShowSidebar] = useState(false)
  const [viewportNavigationFrom, setViewportNavigationFrom] = useState(0)
  const [viewportNavigationTo, setViewportNavigationTo] = useState(0)

  useEffect(() => {
    if (!enableNavigation) {
      setShowSidebar(false)
    } else {
      const onPointer = (event: PointerEvent) => {
        const target = event.target
        const sideNavigation = document.getElementById("side-navigation")

        if (!sideNavigation || !target || !(target instanceof HTMLElement)) {
          return
        }

        if (!sideNavigation.contains(target) && sideNavigation !== target) {
          setShowSidebar(false)
        }
      }

      document.addEventListener("pointerdown", onPointer)

      return () => {
        document.removeEventListener("pointerdown", onPointer)
      }
    }
  }, [enableNavigation])

  useEffect(() => {
    const container = mainContainerRef.current
    const navigationContainer = navigationContainerRef.current

    if (!container || !navigationContainer || !enableNavigation) {
      return
    }

    let navigationRect = navigationContainer.getBoundingClientRect()

    let from = 0,
      to = 0,
      targetFrom = 0,
      targetTo = 0
    const accuracy = (1 / navigationRect.height) * 0.5,
      updateSpeed = 3

    const startAnchors = navigationContainer.querySelectorAll(
      // ":scope > * > button:first-child > *:first-child",
      ":scope > * > div[data-slot=sub-navigation] > button:first-child",
    )
    const endAnchors = navigationContainer.querySelectorAll(
      ":scope > * > div[data-slot=sub-navigation] > button:last-child",
    )

    if (startAnchors.length !== endAnchors.length) {
      throw new Error("Number of start and end anchors do not match")
    }

    const lastElement = Array.from(endAnchors).at(-1)

    const buildSegmentsBounds = () => {
      navigationRect = navigationContainer.getBoundingClientRect()

      return Array.from(startAnchors).map((startAnchor, index) => {
        const startY = getVerticalCenter(startAnchor)
        const endY = getVerticalCenter(endAnchors[index]!)

        const from = (startY - navigationRect.top) / navigationRect.height
        const to = (endY - navigationRect.top) / navigationRect.height

        return {
          from,
          to,
        }
      })
    }

    let viewSegments = buildSegmentsBounds()

    const alignToSegments = (value: number) => {
      const segmentIndex = clamp(
        Math.floor(value * viewSegments.length),
        0,
        viewSegments.length - 1,
      )

      const fraction = value * viewSegments.length - segmentIndex
      const segment = viewSegments[segmentIndex]

      return segment.from + fraction * (segment.to - segment.from)
    }

    const handleContainerScroll = () => {
      const rect = container.getBoundingClientRect()
      const scrollTop = container.scrollTop ?? 0

      const viewportStart =
        (scrollTop - (rect.top + rect.height)) /
        (container.scrollHeight - rect.height)

      const viewportEnd =
        (scrollTop - rect.top) / (container.scrollHeight - rect.height)

      targetFrom = alignToSegments(viewportStart + 0.01)
      targetTo = alignToSegments(viewportEnd - 0.01)
    }

    const viewContainerViewportsPerView = ViewModule.ViewsArray.filter(
      (view) => view !== ViewModule.View.Intro,
    ).map((view) => ({
      view,
      from: 0,
      to: 1,
    }))

    const updateViewContainerViewport = (viewScrollArea: HTMLElement) => {
      const view = viewScrollArea.parentElement?.dataset[
        "view"
      ] as ViewModule.View

      if (!view) {
        return
      }

      const fromFactor = viewScrollArea.scrollTop / viewScrollArea.scrollHeight
      const toFactor =
        (viewScrollArea.scrollTop + viewScrollArea.clientHeight) /
        viewScrollArea.scrollHeight

      const relativeIndex = viewContainerViewportsPerView.findIndex(
        ({ view: _view }) => _view === view,
      )
      viewContainerViewportsPerView[relativeIndex].from = fromFactor
      viewContainerViewportsPerView[relativeIndex].to = toFactor
    }

    const handleViewContainerScroll = (event: Event) => {
      if (!event.target || !(event.target instanceof HTMLElement)) {
        return
      }

      updateViewContainerViewport(event.target)
    }

    const getSegmentIndex = (value: number) => {
      for (let i = 0; i < viewSegments.length; i++) {
        if (value > viewSegments[i].to) {
          continue
        }
        return i
      }

      return viewSegments.length - 1
    }

    let lastTime = 0
    let running = true
    const update = (time: number) => {
      const delta = (time - lastTime) / 1000
      lastTime = time

      if (delta > 500) {
        return
      }

      const fromSegmentIndex = getSegmentIndex(targetFrom)
      const toSegmentIndex = getSegmentIndex(targetTo)

      const relativeFrom = viewContainerViewportsPerView[fromSegmentIndex].from
      const relativeTo = viewContainerViewportsPerView[toSegmentIndex].to

      const preciseTargetFrom =
        targetFrom + relativeFrom * (targetTo - targetFrom)
      const preciseTargetTo = targetFrom + relativeTo * (targetTo - targetFrom)

      const fromDiff = preciseTargetFrom - from
      if (Math.abs(fromDiff) > accuracy) {
        from += fromDiff * delta * updateSpeed
        setViewportNavigationFrom(from * 100)
      }

      const toDiff = preciseTargetTo - to
      if (Math.abs(toDiff) > accuracy) {
        to += toDiff * delta * updateSpeed
        setViewportNavigationTo(to * 100)
      }

      if (running) {
        requestAnimationFrame(update)
      }
    }
    update(0)

    const onAnimationEnd = () => {
      viewSegments = buildSegmentsBounds()
      handleContainerScroll()
    }

    const viewContainers = ViewModule.ViewsArray.reduce((acc, view) => {
      if (view === ViewModule.View.Intro) {
        return acc
      }

      const viewContainer = container.querySelector(
        `#view-${view} > [data-slot='scroll-area-viewport']`,
      )
      if (viewContainer) {
        acc.push(viewContainer as HTMLElement)
      }
      return acc
    }, [] as HTMLElement[])

    const resizeObservers: ResizeObserver[] = []

    for (const viewContainer of viewContainers) {
      viewContainer.addEventListener("scroll", handleViewContainerScroll)

      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const el = entry.target
          if (el instanceof HTMLElement && el === viewContainer) {
            updateViewContainerViewport(el)
          }
        }
      })

      ro.observe(viewContainer)
      resizeObservers.push(ro)
    }

    container.addEventListener("scroll", handleContainerScroll)
    lastElement?.addEventListener("animationend", onAnimationEnd)

    return () => {
      container.removeEventListener("scroll", handleContainerScroll)
      lastElement?.removeEventListener("animationend", onAnimationEnd)
      viewContainers.forEach((viewContainer) =>
        viewContainer.removeEventListener("scroll", handleViewContainerScroll),
      )
      resizeObservers.forEach((ro) => ro.disconnect())

      running = false
    }
  }, [mainContainerRef, enableNavigation])

  return (
    <>
      <ScrollArea
        id="side-navigation"
        className={cn(
          "fixed! left-0 h-dvh xl:sticky! inset-0 w-fit xl:w-full z-10",
          "max-xl:backdrop-blur-lg max-xl:bg-foreground/5 max-xl:border-r max-xl:border-foreground/10 max-xl:shadow-lg transition-[translate] ease-out duration-400",
          (!enableNavigation || !showSidebar) &&
            "max-xl:-translate-x-full ease-in",
        )}
      >
        <aside
          data-current={enableNavigation}
          className="flex flex-col items-center justify-start *:data-[slot=separator]:bg-foreground/20 p-4 gap-y-4 text-muted-foreground"
        >
          <div className="flex flex-row items-center justify-between w-full gap-x-2">
            <NavButton
              className="navigation-transition -my-2 py-4 max-xl:w-auto! w-auto grow"
              onClick={() => setView(ViewModule.View.Intro)}
            >
              <ArrowUpToLine />
              Back to start
            </NavButton>
            <Tooltip disableHoverableContent>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSidebar(false)}
                  className="xl:hidden hover:backdrop-blur-sm hover:bg-foreground/10 hover:text-foreground cursor-pointer"
                >
                  <PanelLeftClose />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Close sidebar navigation</TooltipContent>
            </Tooltip>
          </div>
          <Separator className="navigation-transition fade-in-100 delay-900 mask-linear-[to_right,black,#000a,transparent] -mx-4 w-[calc(100%_+_var(--spacing)*8)]!" />
          <div className="w-full flex flex-row items-stretch gap-x-4 -ml-2">
            <div className="flex flex-col items-center justify-center text-center h-auto navigation-transition fade-in fade-out delay-1500 relative text-[color-mix(in_oklab,_var(--color-primary),_var(--color-secondary)_80%)]">
              <div
                className="block absolute inset-0 inset-x-auto w-px"
                style={{
                  // maskImage: `linear-gradient(to bottom, transparent, black ${viewportNavigationFrom}%, black ${viewportNavigationTo}%, transparent)`,
                  //center: oklch(var(--primary) / 0.75) ${(viewportNavigationFrom + viewportNavigationTo) / 2}%,
                  backgroundImage: `linear-gradient(to bottom, 
                  transparent,
                    currentColor ${(3 * viewportNavigationFrom - viewportNavigationTo) / 2}%,
                      var(--color-muted-foreground) ${viewportNavigationFrom}%,
                      var(--color-muted-foreground) ${viewportNavigationTo}%,
                    currentColor ${(3 * viewportNavigationTo - viewportNavigationFrom) / 2}%,
                  transparent)`,
                }}
              />
              {/*transition-[top] ease-in-out duration-400*/}
              <span
                className="inline absolute top-0 inset-x-0 size-2 rounded-full bg-muted-foreground -translate-1/2"
                style={{
                  top: `${viewportNavigationFrom}%`,
                }}
              />
              <span
                className="inline absolute top-0 inset-x-0 size-2 rounded-full bg-muted-foreground -translate-1/2"
                style={{
                  top: `${viewportNavigationTo}%`,
                }}
              />
            </div>
            <div
              ref={navigationContainerRef}
              className="grow flex flex-col items-stretch text-left"
            >
              {ViewModule.ViewsArray.map(
                (view) =>
                  view !== ViewModule.View.Intro && (
                    <ViewNavigation key={view} view={view} />
                  ),
              )}
            </div>
          </div>
        </aside>
      </ScrollArea>
      <Tooltip disableHoverableContent>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(true)}
            className={cn(
              "xl:hidden fixed top-1 left-1 z-90 text-muted-foreground transition-[translate,color,opacity] hover:backdrop-blur-sm hover:bg-foreground/10 hover:text-foreground cursor-pointer",
              (showSidebar || !enableNavigation) &&
                "text-primary opacity-0 -translate-x-13 pointer-events-none",
            )}
          >
            <PanelLeftOpen />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Open sidebar navigation</TooltipContent>
      </Tooltip>
      <Tooltip disableHoverableContent>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "xl:hidden fixed inset-y-0 left-0 z-80 w-0.5 bg-transparent transition-[background-color,box_shadow,opacity]",
              enableNavigation && !showSidebar
                ? "hover:bg-primary shadow-none hover:shadow-[calc(var(--spacing)*0.5)_0_calc(var(--spacing)*4)_var(--color-foreground),calc(var(--spacing)*0.5)_0_calc(var(--spacing)*2)_var(--color-primary)]"
                : "opacity-0 pointer-events-none",
            )}
            onClick={() => setShowSidebar(true)}
          />
        </TooltipTrigger>
        <TooltipContent>Open sidebar navigation</TooltipContent>
      </Tooltip>
    </>
  )
}

function ViewNavigation({ view }: { view: keyof typeof ViewModule.viewData }) {
  const { view: currentView, setView } = ViewModule.useView()

  const current = currentView === view
  const index = ViewModule.ViewsArray.indexOf(view) - 1
  const hueShift = index * 120

  return (
    <div
      data-slot="view-navigation-group"
      className="flex flex-col items-stretch justify-center gap-y-0.5 not-first:*:first:mt-4 cursor-pointer"
      style={{
        color: `oklch(from var(--color-accent) calc(l + 0.8) calc(c + 0.01) calc(h - ${hueShift}) / 0.5)`,
      }}
      onClick={() => setView(view)}
    >
      <NavButton
        className={cn(
          "text-lg tracking-wide font-light navigation-transition disabled:opacity-100 h-12",
          current && "text-[oklch(from_currentColor_l_c_h_/_1)]",
        )}
        style={{
          animationDelay: `${delayStep + index * 5 * delayStep}ms`,
        }}
        disabled={current}
      >
        {ViewModule.viewData[view].title}
      </NavButton>
      <SubNavigation view={view} delayOffset={(index * 5 + 1) * delayStep} />
    </div>
  )
}

type SubNavigationProps = {
  view: keyof typeof ViewModule.viewData
  delayOffset: number
}

function SubNavigation({ view, delayOffset }: SubNavigationProps) {
  const { setView } = ViewModule.useView()

  const data = useMemo(() => {
    switch (view) {
      case ViewModule.View.Intro:
        throw new Error("Intro view has no sub navigation")
      case ViewModule.View.PublicProjects:
        return Object.values(ProjectsGroup).map((section) => ({
          key: section,
          title: projectsGroupsInfo[section].title,
          icon: projectsGroupsInfo[section].icon,
        }))
      case ViewModule.View.MyJourney:
        return Object.values(JourneySection).map((section) => ({
          key: section,
          title: journeyInfo[section].title,
          icon: journeyInfo[section].icon,
        }))
      case ViewModule.View.TechStack:
        return Object.values(TechStackCategory).map((category) => ({
          key: category,
          title: techStackInfo[category].title,
          icon: techStackInfo[category].icon,
        }))
    }
  }, [view])

  return (
    <div data-slot="sub-navigation" className="flex flex-col pl-3 gap-y-0.5">
      {data.map(({ key, title, icon }, index) => (
        <NavButton
          key={key}
          size="sm"
          nested
          className="navigation-transition slide-in-from-bottom-16 p-2 rounded-full pointer-events-none"
          style={{
            animationDelay: `${delayOffset + index * delayStep}ms`,
          }}
          onClick={() => setView(view)}
        >
          {typeof icon === "string" ? (
            <DynamicIcon name={icon} />
          ) : (
            <IconFromPath
              d={icon.svgPath}
              viewBox="0 0 50 50"
              className="size-4"
            />
          )}
          {title}
        </NavButton>
      ))}
    </div>
  )
}

function NavButton({
  children,
  className,
  nested,
  ...buttonProps
}: ComponentProps<typeof Button> & { nested?: boolean }) {
  return (
    <Button
      variant="ghost"
      {...buttonProps}
      className={cn(
        "w-full h-auto justify-between hover:backdrop-blur-sm hover:bg-foreground/10 hover:text-foreground hover:duration-400 hover:delay-0 hover:*:translate-x-0 hover:*:[svg]:opacity-50 hover:*:ease-out hover:*:delay-0",
        !nested &&
          "in-[[data-slot=view-navigation-group]:hover]:backdrop-blur-sm in-[[data-slot=view-navigation-group]:hover]:bg-foreground/10 in-[[data-slot=view-navigation-group]:hover]:text-foreground in-[[data-slot=view-navigation-group]:hover]:duration-400 in-[[data-slot=view-navigation-group]:hover]:delay-0 in-[[data-slot=view-navigation-group]:hover]:*:translate-x-0 in-[[data-slot=view-navigation-group]:hover]:*:[svg]:opacity-50 in-[[data-slot=view-navigation-group]:hover]:*:ease-out in-[[data-slot=view-navigation-group]:hover]:*:delay-0",
        className,
      )}
    >
      <div className="inline-flex flex-row items-center gap-2 -translate-x-2 transition-transform ease-in-out delay-200">
        {children}
      </div>
      <ChevronRight className="opacity-0 -translate-x-4 transition-[opacity,translate] ease-in-out delay-200" />
    </Button>
  )
}

function getVerticalCenter(element: Element) {
  const rect = element.getBoundingClientRect()
  return rect.top + rect.height / 2
}
