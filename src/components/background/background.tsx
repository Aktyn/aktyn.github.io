import { PropsWithChildren } from "react"
import { LOGO_PATH } from "~/lib/consts"
import { cn } from "~/lib/utils"
import { HexagonGrid } from "./hexagon-grid"

type BackgroundProps = PropsWithChildren<{
  className?: string
}>

export function Background({ children, className }: BackgroundProps) {
  return (
    <div className={cn("bg-background relative w-dvw h-dvh *:z-10", className)}>
      <div className="absolute inset-0 bg-linear-to-b from-[oklch(0.13_0.04_264)] to-[oklch(0.22_0.03_263)] z-1" />
      <div className="overflow-hidden absolute inset-0 z-2 mix-blend-lighten">
        <HexagonGrid
          id="hexagons-base"
          className="**:[path]:stroke-[oklch(0.22_0.03_263)]"
        />
      </div>
      <div
        className="overflow-hidden absolute inset-0 z-3 mix-blend-exclusion"
        style={{
          maskImage:
            "linear-gradient(to bottom, #0003 0%, #0000 20%, #0000 80%, #0002 100%)",
        }}
      >
        <HexagonGrid id="hexagons-accent" className="**:[path]:stroke-white" />
      </div>
      <div className="overflow-hidden absolute inset-0 flex items-center justify-center z-4">
        <svg
          viewBox="0 0 24 24"
          className="aspect-square w-auto h-[61.8%] max-w-[61.8%]"
        >
          <defs>
            <linearGradient
              id="logoGradient"
              x1="0%"
              y1="-30.9%"
              x2="0%"
              y2="130.9%"
            >
              {/* +5% lightness */}
              <stop offset="0%" stopColor="oklch(0.1365 0.04 264)" />
              <stop offset="100%" stopColor="oklch(0.231 0.03 263)" />
            </linearGradient>
          </defs>
          <path d={LOGO_PATH} stroke="none" fill="url(#logoGradient)" />
        </svg>
      </div>
      <div className="overflow-hidden absolute inset-0 flex items-center justify-center mix-blend-overlay z-5">
        <svg
          viewBox="0 0 24 24"
          className="aspect-square w-auto h-[61.8%] max-w-[61.8%] drop-shadow-[0_var(--spacing)_var(--spacing)_#000]"
        >
          <path
            className="stroke-white fixed-stroke"
            d={LOGO_PATH}
            strokeWidth={0.6}
            fill="none"
          />
        </svg>
      </div>
      {children}
    </div>
  )
}
