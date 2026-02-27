import { useMemo } from "react"
import { ProjectedText, type ProjectedTextProps } from "./projected-text"
import { isWebglAvailable } from "~/graphics/graphics-helpers"
import { cn } from "~/lib/utils"

export function ContentLayer({
  webScene,
}: Pick<ProjectedTextProps, "webScene">) {
  const webGLAvailable = useMemo(() => isWebglAvailable(), [])

  return (
    <div
      className={cn(
        "h-screen w-full overflow-hidden print:**:[span]:text-[#001814]",
        webGLAvailable && "not-print:text-transparent",
      )}
    >
      <div className="text-center mt-40">
        <ProjectedText
          text="Aktyn"
          webScene={webScene}
          fontSize={96}
          fontWeight="bold"
          className="text-[#80CBC4]"
        />
      </div>
      <div className="px-20 break-normal whitespace-break-spaces">
        <ProjectedText
          text="Another text, multi word sentence"
          webScene={webScene}
          fontSize={84}
          fontWeight="light"
          className="text-[#80CBC4]"
        />
      </div>
    </div>
  )
}
