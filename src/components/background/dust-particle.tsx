import { useMemo } from "react"
import { randomFloat, randomInt } from "~/lib/random.ts"

import "./dust-particle.css"

export function DustParticle() {
  const moveUpDistance = 25
  const horizontalPadding = 5

  const [[x, y, sizePx], hue, opacity, durationMs] = useMemo(() => {
    const size = randomInt(2, 5)

    const transform = [
      randomInt(horizontalPadding, 100 - horizontalPadding - size),
      randomInt(moveUpDistance, 100),
      size,
    ]

    return [
      transform,
      randomInt(0, 360),
      randomFloat(0.25, 0.5),
      randomInt(10_000, 20_000),
    ]
  }, [])

  return (
    <span
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: `dust-up ease-in-out infinite`,
        animationDuration: `${durationMs}ms`,
        animationDelay: "-20000ms",
      }}
    >
      <span
        className="inline-block rounded-full"
        style={{
          opacity,
          backgroundColor: `hsl(${hue}, 100%, 90%)`,
          width: `${sizePx}px`,
          height: `${sizePx}px`,
          animation: "dust-scale ease-in-out infinite",
          animationDuration: `${durationMs}ms`,
          animationDelay: "-20000ms",
        }}
      />
    </span>
  )
}
