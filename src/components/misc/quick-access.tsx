import { ViewModule } from "~/modules/view.module"
import type { ComponentProps } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { clamp, cn } from "~/lib/utils"
import { MousePointerClick } from "lucide-react"
import { projectsGroupsInfo, ProjectsGroup } from "~/lib/projects-info"
import { journeyInfo, JourneySection } from "~/lib/journey-info"
import { TechStackCategory, techStackInfo } from "~/lib/tech-stack"
import { Separator } from "~/components/ui/separator"

export function QuickAccess(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "max-w-full w-auto mx-auto flex flex-col justify-start px-4",
        props.className,
      )}
    >
      <div className="flex flex-row flex-wrap items-stretch justify-center gap-8 *:grow max-w-384">
        {ViewModule.ViewsArray.map(
          (view) =>
            view !== ViewModule.View.Intro && (
              <ViewCard key={view} view={view} />
            ),
        )}
      </div>
    </div>
  )
}

function ViewCard({ view }: { view: keyof typeof ViewModule.viewData }) {
  const ref = useRef<HTMLDivElement>(null)
  const { setView } = ViewModule.useView()

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  const viewIndex = ViewModule.ViewsArray.indexOf(view)
  const hueShift = (viewIndex - 1) * 120

  const chroma = "calc(c - 0.01)"

  useEffect(() => {
    const container = ref.current

    if (!container) {
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const relativeX =
        clamp(event.clientX - rect.left, 0, rect.width) - rect.width / 2
      const relativeY =
        clamp(event.clientY - rect.top, 0, rect.height) - rect.height / 2

      setCursorPosition({ x: relativeX, y: relativeY })
    }

    document.addEventListener("pointermove", onPointerMove)

    return () => {
      document.removeEventListener("pointermove", onPointerMove)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "min-w-[calc(50%_-_calc(var(--spacing)*4))] flex flex-col items-center gap-2 backdrop-blur-sm p-4 pt-2 border border-white/20 rounded-2xl text-center not-hover:shadow-lg! relative overflow-visible cursor-pointer hover:*:last:*:last:translate-y-0 hover:*:last:*:first:opacity-100! transition-[border-color,box-shadow] duration-500 hover:border-white/60 hover:*:data-[slot=separator]:opacity-60",
        view === ViewModule.View.PublicProjects && "min-w-1/2",
      )}
      style={{
        backgroundColor: `oklch(from var(--color-accent) calc(l + 0.05) ${chroma} calc(h - ${hueShift}) / 0.3)`,
        color: `oklch(from var(--color-accent) calc(l + 0.6) c calc(h - ${hueShift}))`,
        boxShadow: `0 0 calc(var(--spacing)*16) oklch(from var(--color-accent) calc(l + 0.6) calc(c + 0.075) calc(h - ${hueShift}) / 0.3)`,
      }}
      onClick={() => setView(view)}
    >
      <div className="absolute inset-0 -z-20 bg-linear-150 from-transparent via-foreground/7 to-transparent opacity-100 transition-opacity ease-out duration-500 rounded-[inherit] pointer-events-none" />
      <h4 className="text-xl tracking-wide font-semibold leading-snug text-balance whitespace-pre-wrap">
        {ViewModule.viewData[view].extendedTitle}
      </h4>
      <Separator className="bg-[currentColor] opacity-20 mask-linear-[to_right,transparent,black,transparent] transition-opacity" />
      <ViewContent view={view} />

      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] -z-10">
        <div
          className="absolute opacity-0 transition-opacity duration-500 pointer-events-none"
          style={{
            width: "200%",
            height: "200%",
            top: "-50%",
            left: "-50%",
            backgroundImage: `radial-gradient(circle at center, oklch(from var(--color-accent) calc(l + 0.6) calc(c + 0.075) calc(h - ${hueShift}) / 0.3), transparent 70%)`,
            transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`,
          }}
        />
        <div className="absolute bottom-1 inset-x-0 flex flex-row items-center justify-center gap-1 text-sm font-semibold text-white pointer-events-none translate-y-8 transition-transform ease-out z-20 text-shadow-lg">
          <MousePointerClick className="size-4" />
          <span>Click to see more</span>
        </div>
      </div>
    </div>
  )
}

function ViewContent({ view }: { view: keyof typeof ViewModule.viewData }) {
  const data = useMemo(() => {
    switch (view) {
      case ViewModule.View.Intro:
        throw new Error("Intro view has no content")
      case ViewModule.View.PublicProjects:
        return Object.values(ProjectsGroup).map((section) => ({
          key: section,
          title: projectsGroupsInfo[section].title,
          thumbnail: projectsGroupsInfo[section].thumbnail,
        }))
      case ViewModule.View.MyJourney:
        return Object.values(JourneySection).map((section) => ({
          key: section,
          title: journeyInfo[section].title,
          thumbnail: journeyInfo[section].thumbnail,
        }))
      case ViewModule.View.TechStack:
        return Object.values(TechStackCategory).map((category) => ({
          key: category,
          title: techStackInfo[category].title,
          thumbnail: techStackInfo[category].thumbnail,
        }))
    }
  }, [view])

  return (
    <div
      className="w-[calc(100%+var(--spacing)*8)] inline-flex flex-row gap-x-0 overflow-hidden -m-4 p-4 *:not-data-[slot=separator]:flex-1 rounded-b-[inherit] overflow-x-auto no-scrollbar z-10 hover:**:[img]:blur-[0px]"
      style={{
        maskImage:
          "linear-gradient(to bottom, #fff0 0%, white calc(var(--spacing)*16))",
      }}
    >
      {data.map(({ key, title, thumbnail }) => (
        <div
          key={key}
          className="flex flex-col items-stretch justify-center h-32 w-auto relative aspect-4/3 not-first:*:[img]:mask-l-from-25% not-last:*:[img]:mask-r-from-25% hover:*:[img]:opacity-100 odd:hover:*:[img]:rotate-15 even:hover:*:[img]:-rotate-15 hover:*:[img]:scale-175 hover:*:[h5]:scale-110 hover:*:[h5]:-translate-y-2"
        >
          <h5 className="whitespace-pre-wrap absolute inset-2 inset-y-auto m-auto z-10 font-bold text-lg text-shadow-[0_0_2px_#000,0_0_calc(var(--spacing)*4)_#000] transition-transform ease-in-out">
            {title}
          </h5>
          <img
            alt={title}
            src={thumbnail}
            className="h-full object-cover opacity-50 scale-125 pointer-events-none transition-[opacity,scale,rotate,filter] ease-in-out blur-[1.25px]"
          />
        </div>
      ))}
    </div>
  )
}

// function MyJourneyContent() {
//   return <div>my journey</div>
// }
//
// function TechStackContent() {
//   return <div>tech stack</div>
// }
