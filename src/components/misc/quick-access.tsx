import { ViewModule } from "~/modules/view.module"
import type { ComponentProps } from "react"
import { useRef } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { cn } from "~/lib/utils"
import { MousePointerClick } from "lucide-react"

export function QuickAccess(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "max-w-full w-auto mx-auto inline-flex flex-row flex-wrap items-stretch justify-center gap-8 *:flex-1 px-4",
        props.className,
      )}
    >
      {ViewModule.ViewsArray.map(
        (view) =>
          view !== ViewModule.View.Intro && <ViewCard key={view} view={view} />,
      )}
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
      const relativeX = event.clientX - rect.left
      const relativeY = event.clientY - rect.top

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
      className="flex flex-col gap-2 xs:min-w-md max-xs:min-w-full w-md max-w-screen! backdrop-blur-sm p-4 pb-6 border border-white/20 rounded-2xl text-center not-hover:shadow-lg! relative overflow-hidden cursor-pointer hover:*:last:translate-y-0 hover:*:nth-last-2:opacity-100 transition-[border-color,box-shadow] duration-500 hover:border-white/60"
      style={{
        backgroundColor: `oklch(from var(--color-accent) calc(l + 0.05) ${chroma} calc(h - ${hueShift}) / 0.3)`,
        color: `oklch(from var(--color-accent) calc(l + 0.6) c calc(h - ${hueShift}))`,
        boxShadow: `0 0 calc(var(--spacing)*16) oklch(from var(--color-accent) calc(l + 0.6) calc(c + 0.075) calc(h - ${hueShift}) / 0.3)`,
      }}
      onClick={() => setView(view)}
    >
      <div className="absolute inset-0 -z-20 bg-linear-150 from-transparent via-foreground/7 to-transparent opacity-100 transition-opacity ease-out duration-500" />
      <h4 className="text-lg tracking-wide font-semibold leading-snug text-balance whitespace-pre-wrap">
        {ViewModule.viewData[view].extendedTitle}
      </h4>
      <div>TODO: other content or quick info</div>

      <div
        className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 size-full"
        style={{
          backgroundImage: `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, oklch(from var(--color-accent) calc(l + 0.6) calc(c + 0.075) calc(h - ${hueShift}) / 0.3), transparent)`,
        }}
      />
      <div className="absolute bottom-2 inset-x-0 flex flex-row items-center justify-center gap-1 text-sm font-semibold text-white/80 pointer-events-none translate-y-8 transition-transform ease-out">
        <MousePointerClick className="size-4" />
        <span>Click to open</span>
      </div>
    </div>
  )
}
