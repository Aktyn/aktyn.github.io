import type { ComponentProps } from "react"
import { useEffect, useState } from "react"
import { isFirefox, LOGO_PATH } from "~/lib/consts"
import { cn } from "~/lib/utils"
import { HexagonGrid } from "./hexagon-grid"
import { DustParticle } from "~/components/background/dust-particle.tsx"

const backlightRadius = 80

export function Background({
  children,
  className,
  ...divProps
}: ComponentProps<"div">) {
  return (
    <div
      {...divProps}
      className={cn(
        "relative w-dvw h-dvh *:absolute *:inset-0 *:last:z-20",
        className,
      )}
    >
      <div
        className={cn(
          "bg-linear-to-b from-[oklch(0.13_0.04_264)] to-[oklch(0.22_0.03_263)] *:z-10 **:[.logo]:aspect-square **:[.logo]:w-auto **:[.logo]:h-[61.8%] **:[.logo]:max-w-[61.8%] pointer-events-none",
          !isFirefox && //TODO: check whether it still doesn't work on firefox
            "**:[.logo]:animate-in **:[.logo]:fade-in **:[.logo]:zoom-in-125 **:[.logo]:duration-1500 **:[.logo]:fill-mode-both",
        )}
      >
        <div className="overflow-hidden absolute inset-0 mix-blend-soft-light">
          {Array.from({ length: 128 }).map((_, i) => (
            <DustParticle key={i} />
          ))}
        </div>
        <FancyBackground />
      </div>
      {children}
    </div>
  )
}

function FancyBackground() {
  const [cursorPosition, setCursorPosition] = useState<{
    x: number
    y: number
    centerFactor: number
  }>({
    x: 0,
    y: 0,
    centerFactor: 0,
  })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const centerFactor = Math.abs(
        (event.clientY * 2) / window.innerHeight - 1,
      )
      setCursorPosition({ x: event.clientX, y: event.clientY, centerFactor })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const centerFactor = Math.max(0.3, cursorPosition.centerFactor)

  return (
    <>
      <div className="overflow-hidden absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,oklch(65.39%_0.1926_10_/0.2)_0%,oklch(65.39%_0.1926_10_/0.075)_50%,transparent_100%)] animate-in fade-in slide-in-from-top duration-800 transition-transform" />
      <div
        className={cn(
          "overflow-hidden absolute inset-0 transition-opacity duration-500",
          cursorPosition.x === 0 && cursorPosition.y === 0
            ? "opacity-0"
            : "opacity-100",
        )}
        style={{
          maskImage: `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, #000 0rem, #0004 calc(var(--spacing) * ${(backlightRadius / 2) * centerFactor}), #0000 calc(var(--spacing) * ${backlightRadius * centerFactor}))`,
        }}
      >
        <HexagonGrid
          id="hexagons-accent-blur"
          className="**:[path]:stroke-[#DA6C91] blur-[6px]"
          strokeWidth={1}
        />
      </div>
      <div className="overflow-hidden absolute inset-0 mix-blend-lighten">
        <HexagonGrid
          id="hexagons-base"
          className="**:[path]:stroke-[oklch(0.22_0.03_263)]"
        />
      </div>
      <div
        className="overflow-hidden absolute inset-0 mix-blend-exclusion"
        style={{
          maskImage:
            "linear-gradient(to bottom, #0003 0%, #0000 20%, #0000 80%, #0002 100%)",
        }}
      >
        <HexagonGrid id="hexagons-accent" className="**:[path]:stroke-white" />
      </div>
      <div
        className={cn(
          "overflow-hidden absolute inset-0 flex items-center justify-center blur-2xl mix-blend-soft-light transition-opacity duration-500",
          cursorPosition.x === 0 && cursorPosition.y === 0
            ? "opacity-0"
            : "opacity-100",
        )}
        style={{
          maskImage: `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, #000 0rem, #000a calc(var(--spacing) * ${backlightRadius / 2}), #0000 calc(var(--spacing) * ${backlightRadius}))`,
        }}
      >
        <svg viewBox="0 0 24 24" className="logo animate-none">
          <path d={LOGO_PATH} fill="white" stroke="none" />
        </svg>
      </div>
      <div className="overflow-hidden absolute inset-0 flex items-center justify-center blur-none mix-blend-soft-light">
        <svg
          viewBox="0 0 24 24"
          className="logo delay-1500 zoom-in-100! fill-mode-both"
        >
          <path
            d={LOGO_PATH}
            fill="white"
            stroke="oklch(65.39% 0.1926 25.14)"
            className="fixed-stroke"
            strokeWidth={1}
          />
        </svg>
      </div>
      <div className="overflow-hidden absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="logo">
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
      <div className="overflow-hidden absolute inset-0 flex items-center justify-center mix-blend-overlay">
        <svg
          viewBox="0 0 24 24"
          className="logo drop-shadow-[0_var(--spacing)_var(--spacing)_#000]"
        >
          <path
            className="fixed-stroke"
            d={LOGO_PATH}
            strokeWidth={0.6}
            fill="none"
            stroke="white"
          />
        </svg>
      </div>
    </>
  )
}
