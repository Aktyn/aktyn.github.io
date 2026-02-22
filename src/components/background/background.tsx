import { useEffect, useRef, type ComponentProps } from "react"
import { WebScene } from "~/graphics/web-scene"
import { cn } from "~/lib/utils"

export function Background({
  children,
  className,
  ...divProps
}: ComponentProps<"div">) {
  const sceneContainerRef = useRef<HTMLDivElement>(null)
  // const windowSize = useWindowSize()

  useEffect(() => {
    const container = sceneContainerRef.current
    if (!container) {
      return
    }

    const scene = new WebScene(container)

    return () => {
      scene.dispose()
    }
  }, [])

  return (
    <div
      {...divProps}
      className={cn(
        "relative w-dvw h-dvh *:absolute *:inset-0 *:last:z-20 overflow-hidden",
        className,
      )}
    >
      {/* <GodraysLayer /> */}
      <div ref={sceneContainerRef} className="z-10 pointer-events-none" />
      {/* <LogoLayer /> */}
      {children}
    </div>
  )
}

// function LogoLayer() {
//   return (
//     <svg viewBox="0 0 24 24" className="size-full">
//       <path
//         d={LOGO_PATH}
//         fill="#ffffff18"
//         stroke="white"
//         vectorEffect="non-scaling-stroke"
//         strokeWidth={1}
//         className="opacity-20" // Dim the logo to see text
//       />
//     </svg>
//   )
// }
