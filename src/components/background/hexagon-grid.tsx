import { cn } from "~/lib/utils"

const innerHexagonRadius = 48

type HexagonGridProps = {
  id: string
  className?: string
  strokeWidth?: number
}

export function HexagonGrid({
  id,
  className,
  strokeWidth = 0.35,
}: HexagonGridProps) {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      strokeWidth={strokeWidth}
      className={cn(
        "animate-in fade-in duration-1000 delay-800 fill-mode-both",
        className,
      )}
    >
      <defs>
        <pattern
          id={`grid-odd-${id}`}
          width={innerHexagonRadius * 2}
          height={(innerHexagonRadius / Math.sqrt(3)) * 6}
          patternUnits="userSpaceOnUse"
        >
          <path d={hexagonPath} />
        </pattern>
        <pattern
          id={`grid-even-${id}`}
          width={innerHexagonRadius * 2}
          height={(innerHexagonRadius / Math.sqrt(3)) * 6}
          patternUnits="userSpaceOnUse"
          x={innerHexagonRadius}
          y={(innerHexagonRadius / Math.sqrt(3)) * 3}
        >
          <path d={hexagonPath} />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill={`url(#grid-odd-${id})`} />
      <rect width="100%" height="100%" fill={`url(#grid-even-${id})`} />
    </svg>
  )
}

/** NOTE: hexagon points can be generated with below script:\
  (() => {\
    const points = []\
    const sides = 6\
    const r = 48 / Math.sqrt(3)*2\
    const x = 48\
    const y = 48 / Math.sqrt(3)*2\
    for(let i=0; i<sides; i++) {\
      const a = Math.PI*2 / sides * (i+0.5)\
      points.push([\
        x + Math.cos(a)*r,\
        y + Math.sin(a)*r\
      ])\
    } \
    console.log(points.map(p => `${p[0]},${p[1]}`).join(' '))\
  })()
*/
const hexagonPath =
  "M 96,83.13843876330611 48,110.85125168440815 7.105427357601002e-15,83.13843876330614 -1.4210854715202004e-14,27.712812921102053"
