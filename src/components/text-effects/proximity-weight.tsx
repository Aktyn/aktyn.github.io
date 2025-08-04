import type { ComponentProps } from "react"
import { useEffect, useMemo, useRef } from "react"
import { clamp } from "~/lib/utils"

type ProximityWeightProps = ComponentProps<"div"> & {
  component?: string
  baseWeight?: number
  maxWeight?: number
  proximity?: number
}

export function ProximityWeight({
  component: Component = "div",
  baseWeight = 500,
  maxWeight = 700,
  proximity = 128,
  children,
  ...divProps
}: ProximityWeightProps) {
  const internalRef = useRef<HTMLDivElement>(null)

  const ref = divProps.ref ?? internalRef

  const symbols = useMemo(() => {
    if (typeof children !== "string") {
      return []
    }

    return children.split("")
  }, [children])

  useEffect(() => {
    const element =
      typeof ref === "function" ? internalRef.current : ref.current

    if (!element || !symbols.length) {
      return
    }

    const nonBlankSymbolElements = Array.from(
      element.querySelectorAll<HTMLSpanElement>(":scope > span"),
    ).filter((span) => span.innerText.trim() !== "")

    const onMouseMove = (event: MouseEvent) => {
      for (const element of nonBlankSymbolElements) {
        const box = element.getBoundingClientRect()
        const centerX = box.left + box.width / 2
        const centerY = box.top + box.height / 2
        const distance = Math.sqrt(
          (event.x - centerX) ** 2 + (event.y - centerY) ** 2,
        )

        const weightFactor = 1 - clamp(distance / proximity, 0, 1)
        element.style.fontWeight = Math.round(
          baseWeight + (maxWeight - baseWeight) * weightFactor ** 2,
        ).toString()
      }
    }

    document.addEventListener("mousemove", onMouseMove)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
    }
  }, [baseWeight, maxWeight, proximity, ref, symbols.length])

  const props = {
    ...divProps,
    ref,
    style: {
      ...divProps.style,
      fontWeight: baseWeight,
    },
    children: symbols.map((symbol, index) => <span key={index}>{symbol}</span>),
  }

  return <Component {...props} />
}
