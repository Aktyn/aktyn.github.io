import { Fragment, useEffect, useRef, type ComponentProps } from "react"
import { fontWeightValues, type FontWeight } from "~/graphics/fonts"
import { type SceneObject } from "~/graphics/scene-object"
import { type WebScene } from "~/graphics/web-scene"
import { omit } from "~/lib/utils"

const defaultFontSize = 16
const defaultFontWeight: FontWeight = "medium"

export type ProjectedTextProps = {
  text: string
  color?: string
  fontSize?: number
  fontWeight?: FontWeight
  webScene: WebScene
} & ComponentProps<"span">

export function ProjectedText(props: ProjectedTextProps) {
  const words = props.text.split(" ")

  return words.map((word, index) => (
    <Fragment key={index}>
      <ProjectedWord {...props} text={word} />
      {index < words.length - 1 && (
        <Space {...omit(props, "text", "color", "webScene")} />
      )}
    </Fragment>
  ))
}

function ProjectedWord({
  text: word,
  color = "#001814",
  fontSize = defaultFontSize,
  fontWeight = defaultFontWeight,
  webScene,
  ...spanProps
}: ProjectedTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    let sceneObject: SceneObject | null = null
    let mounted = true
    let animationFrameId: number

    webScene
      .createTextObject(word, fontSize, color, fontWeight)
      .then((object) => {
        if (!mounted) {
          object.remove()
          return
        }
        sceneObject = object

        //TODO: optimize (run only when span element moves or window resizes)
        const updatePosition = () => {
          if (ref.current && sceneObject) {
            sceneObject.alignToElement(ref.current, webScene.getCamera())
          }
          animationFrameId = requestAnimationFrame(updatePosition)
        }
        updatePosition()
      })
      .catch(console.error)

    return () => {
      mounted = false
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId)
      }
      if (sceneObject) {
        sceneObject.remove()
      }
    }
  }, [word, webScene, fontSize, fontWeight, color])

  return (
    <span
      ref={ref}
      {...spanProps}
      className={spanProps.className}
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: fontWeightValues[fontWeight],
        ...spanProps.style,
      }}
    >
      {word}
    </span>
  )
}

function Space({
  fontSize = defaultFontSize,
  fontWeight = defaultFontWeight,
  ...spanProps
}: Omit<ProjectedTextProps, "text" | "color" | "webScene">) {
  return (
    <span
      {...spanProps}
      className={spanProps.className}
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: fontWeightValues[fontWeight],
        ...spanProps.style,
      }}
    >
      {" "}
    </span>
  )
}
