import {
  Fragment,
  useCallback,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithoutRef,
} from 'react'
import { fontWeightValues, type FontWeight } from '~/graphics/fonts'
import { type WebScene } from '~/graphics/web-scene'
import { omit } from '~/lib/utils'
import type { ProjectedComponentProps } from './content-helpers'
import { useProjectedSceneObject } from './useProjectedSceneObject'
import { colors } from './colors'

const defaultFontSize = 16
const defaultFontWeight: FontWeight = 'medium'

export type ProjectedTextProps = ProjectedComponentProps & {
  text: string
  splitWords?: boolean
  fontSize?: number
  fontWeight?: FontWeight
} & ComponentPropsWithoutRef<'span'>

export function ProjectedText({ text, splitWords = true, ...props }: ProjectedTextProps) {
  const words = splitWords ? text.split(' ') : [text]

  return words.map((word, index) => (
    <Fragment key={index}>
      <ProjectedWord {...props} text={word} />
      {index < words.length - 1 && <Space {...omit(props, 'color', 'frontColor')} />}
    </Fragment>
  ))
}

function ProjectedWord({
  ref: interfaceRef,
  as: Slot = 'span',
  text: word,
  color = colors.side,
  frontColor = colors.front,
  fontSize = defaultFontSize,
  fontWeight = defaultFontWeight,
  lowPriority,
  ...spanProps
}: ProjectedTextProps) {
  const ref = useRef<Element>(null)

  const objectFactory = useCallback(
    (webScene: WebScene) =>
      webScene
        .createTextObject(word, fontSize, color, frontColor, fontWeight)
        .then((obj) => (lowPriority ? obj.setLowPriority() : obj)),
    [color, fontSize, fontWeight, frontColor, word, lowPriority],
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
