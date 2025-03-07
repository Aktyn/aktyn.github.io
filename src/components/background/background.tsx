import { PropsWithChildren } from "react"
import { LOGO_PATH } from "~/lib/consts"
import { cn } from "~/lib/utils"

const innerHexagonRadius = 48

type BackgroundProps = PropsWithChildren<{
  className?: string
}>

export function Background({ children, className }: BackgroundProps) {
  return (
    <div className={cn("bg-background relative w-dvw h-dvh", className)}>
      <div className="absolute inset-0 bg-linear-to-b from-[#020617] to-[#121a2a]" />
      <div className="absolute inset-0">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          strokeWidth={0.25}
          className="mix-blend-lighten"
        >
          <defs>
            <pattern
              id="grid-odd"
              width={innerHexagonRadius * 2}
              height={(innerHexagonRadius / Math.sqrt(3)) * 6}
              patternUnits="userSpaceOnUse"
            >
              <path d={hexagonPath} stroke="#121a2a" />
            </pattern>
            <pattern
              id="grid-even"
              width={innerHexagonRadius * 2}
              height={(innerHexagonRadius / Math.sqrt(3)) * 6}
              patternUnits="userSpaceOnUse"
              x={innerHexagonRadius}
              y={(innerHexagonRadius / Math.sqrt(3)) * 3}
            >
              <path d={hexagonPath} stroke="#121a2a" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid-odd)" />
          <rect width="100%" height="100%" fill="url(#grid-even)" />
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center mix-blend-overlay">
        <svg
          viewBox="0 0 24 24"
          className="aspect-square w-auto h-[61.8%] max-w-[61.8%] drop-shadow-[0_var(--spacing)_var(--spacing)_#020617]"
        >
          <path
            className="stroke-white fill-white/10 fixed-stroke"
            d={LOGO_PATH}
            strokeWidth={0.5}
          />
        </svg>
      </div>
      {children}
    </div>
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
