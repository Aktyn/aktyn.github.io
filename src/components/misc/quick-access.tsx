import { ViewModule } from '~/modules/view.module'
import { type ComponentProps, useEffect, useMemo, useRef, useState } from 'react'
import { clamp, cn } from '~/lib/utils'
import { MousePointerClick } from 'lucide-react'
import { projectsGroupsInfo, ProjectsGroup } from '~/lib/projects-info'
import { journeyInfo, JourneySection } from '~/lib/journey-info'
import { TechStackCategory, techStackInfo } from '~/lib/tech-stack'
import { Separator } from '~/components/common/ui'

export function QuickAccess(props: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('mx-auto flex w-auto max-w-full flex-col justify-start px-4', props.className)}
    >
      <div className="flex max-w-384 flex-row flex-wrap items-stretch justify-center gap-8 *:grow">
        {[ViewModule.View.MyJourney, ViewModule.View.TechStack, ViewModule.View.PublicProjects].map(
          (view) => view !== ViewModule.View.Intro && <ViewCard key={view} view={view} />,
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

  const chroma = 'calc(c - 0.01)'

  useEffect(() => {
    const container = ref.current

    if (!container) {
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const relativeX = clamp(event.clientX - rect.left, 0, rect.width) - rect.width / 2
      const relativeY = clamp(event.clientY - rect.top, 0, rect.height) - rect.height / 2

      setCursorPosition({ x: relativeX, y: relativeY })
    }

    document.addEventListener('pointermove', onPointerMove)

    return () => {
      document.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex min-w-[calc(50%-calc(var(--spacing)*4))] cursor-pointer flex-col items-center gap-2 overflow-visible rounded-2xl border border-white/20 p-4 pt-2 text-center backdrop-blur-sm transition-[border-color,box-shadow] duration-500 not-hover:shadow-lg! hover:border-white/60 hover:*:last:*:last:translate-y-0 hover:*:last:*:first:opacity-100! hover:*:data-[slot=separator]:opacity-60',
        view === ViewModule.View.PublicProjects && 'min-w-1/2',
      )}
      style={{
        backgroundColor: `oklch(from var(--color-accent) calc(l + 0.05) ${chroma} calc(h - ${hueShift}) / 0.3)`,
        color: `oklch(from var(--color-accent) calc(l + 0.6) c calc(h - ${hueShift}))`,
        boxShadow: `0 0 calc(var(--spacing)*16) oklch(from var(--color-accent) calc(l + 0.6) calc(c + 0.075) calc(h - ${hueShift}) / 0.3)`,
      }}
      onClick={() => setView(view)}
    >
      <div className="pointer-events-none absolute inset-0 -z-20 rounded-[inherit] bg-linear-150 from-transparent via-foreground/7 to-transparent opacity-100 transition-opacity duration-500 ease-out" />
      <h4 className="text-xl leading-snug font-semibold tracking-wide text-balance whitespace-pre-wrap">
        {ViewModule.viewData[view].extendedTitle}
      </h4>
      <Separator className="bg-[currentColor] mask-linear-[to_right,transparent,black,transparent] opacity-20 transition-opacity" />
      <ViewContent view={view} />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
        <div
          className="pointer-events-none absolute opacity-0 transition-opacity duration-500"
          style={{
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            backgroundImage: `radial-gradient(circle at center, oklch(from var(--color-accent) calc(l + 0.6) calc(c + 0.075) calc(h - ${hueShift}) / 0.3), transparent 70%)`,
            transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`,
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-1 z-20 flex translate-y-8 flex-row items-center justify-center gap-1 text-sm font-semibold text-white transition-transform ease-out text-shadow-lg">
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
        throw new Error('Intro view has no content')
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
      className="z-10 -m-4 no-scrollbar inline-flex w-[calc(100%+var(--spacing)*8)] flex-row gap-x-0 overflow-hidden overflow-x-auto rounded-b-[inherit] p-4 *:not-data-[slot=separator]:flex-1 hover:**:[img]:blur-[0px]"
      style={{
        maskImage: 'linear-gradient(to bottom, #fff0 0%, white calc(var(--spacing)*16))',
      }}
    >
      {data.map(({ key, title, thumbnail }) => (
        <div
          key={key}
          className="relative flex aspect-4/3 h-32 w-auto flex-col items-stretch justify-center hover:*:[h5]:-translate-y-2 hover:*:[h5]:scale-110 not-first:*:[img]:mask-l-from-25% not-last:*:[img]:mask-r-from-25% hover:*:[img]:scale-175 hover:*:[img]:opacity-100 odd:hover:*:[img]:rotate-15 even:hover:*:[img]:-rotate-15"
        >
          <h5 className="absolute inset-2 inset-y-auto z-10 m-auto text-lg font-bold whitespace-pre-wrap transition-transform ease-in-out text-shadow-[0_0_2px_#000,0_0_calc(var(--spacing)*4)_#000]">
            {title}
          </h5>
          <img
            alt={title}
            src={thumbnail}
            className="pointer-events-none h-full scale-125 object-cover opacity-50 blur-[1.25px] transition-[opacity,scale,rotate,filter] ease-in-out"
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
