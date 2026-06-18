import {
  Fragment,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
} from 'react'
import { fontWeightValues, type FontWeight } from '~/graphics/fonts'
import type { WebScene } from '~/graphics/web-scene'
import { omit } from '~/lib/utils'
import type { ProjectedComponentProps } from '../content-helpers'
import { useProjectedSceneObject } from '../useProjectedSceneObject'
import { SceneContext } from '../scene-context'

const defaultFontSize = 16
const defaultFontWeight: FontWeight = 'medium'

export type ProjectedTextProps<As extends ElementType = 'span'> = ProjectedComponentProps<As> & {
  text: string
  splitWords?: boolean
  fontSize?: number
  fontWeight?: FontWeight
} & ComponentPropsWithoutRef<As>

export function ProjectedText<As extends ElementType = 'span'>({
  text,
  splitWords = true,
  ...props
}: ProjectedTextProps<As>) {
  const { webScene } = useContext(SceneContext)

  // Fallback to simple span element in no-webgl mode
  if (!webScene) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fontSize, fontWeight, ref, as, lowPriority, ...spanProps } = props
    return (
      <span
        {...spanProps}
        style={{
          fontSize: `${fontSize ?? defaultFontSize}px`,
          fontWeight: fontWeightValues[fontWeight ?? defaultFontWeight],
          ...spanProps.style,
        }}
      >
        {text}
      </span>
    )
  }

  const words = splitWords ? text.split(' ') : [text]

  return words.map((word, index) => (
    <Fragment key={index}>
      <ProjectedWord {...props} text={word} />
      {index < words.length - 1 && <Space {...omit(props, 'lowPriority')} />}
    </Fragment>
  ))
}

function ProjectedWord({
  ref: interfaceRef,
  as: Slot = 'span',
  text: word,
  fontSize = defaultFontSize,
  fontWeight = defaultFontWeight,
  lowPriority,
  ...spanProps
}: ProjectedTextProps) {
  const ref = useRef<Element>(null)

  const objectFactory = useCallback(
    (webScene: WebScene) =>
      webScene
        .createTextObject(word, fontSize, fontWeight)
        .then((obj) => (lowPriority ? obj.setLowPriority() : obj)),
    [fontSize, fontWeight, word, lowPriority],
  )
  const projectedScene = useProjectedSceneObject(ref, objectFactory)

  useImperativeHandle(
    interfaceRef,
    () => ({
      ...projectedScene,
      elementRef: ref,
    }),
    [projectedScene, ref],
  )

  return (
    <Slot
      ref={ref as never}
      {...spanProps}
      className={spanProps.className}
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: fontWeightValues[fontWeight],
        ...spanProps.style,
      }}
    >
      {word}
    </Slot>
  )
}

function Space({
  fontSize = defaultFontSize,
  fontWeight = defaultFontWeight,
  ...spanProps
}: Omit<ProjectedTextProps, 'ref' | 'text' | 'color' | 'frontColor' | 'webScene'>) {
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
      {' '}
    </span>
  )
}
