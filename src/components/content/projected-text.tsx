import {
  type ComponentPropsWithoutRef,
  Fragment,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react'
import { fontWeightValues, type FontWeight } from '~/graphics/fonts'
import { type WebScene } from '~/graphics/web-scene'
import { omit } from '~/lib/utils'
import type { ProjectedComponentProps } from './content-helpers'
import { useProjectedSceneObject } from './useProjectedSceneObject'

const defaultFontSize = 16
const defaultFontWeight: FontWeight = 'medium'

export type ProjectedTextProps = ProjectedComponentProps & {
  text: string
  fontSize?: number
  fontWeight?: FontWeight
} & ComponentPropsWithoutRef<'span'>

export function ProjectedText(props: ProjectedTextProps) {
  const words = props.text.split(' ')

  return words.map((word, index) => (
    <Fragment key={index}>
      <ProjectedWord {...props} text={word} />
      {index < words.length - 1 && <Space {...omit(props, 'text', 'color', 'frontColor')} />}
    </Fragment>
  ))
}

function ProjectedWord({
  ref: interfaceRef,
  text: word,
  color = '#002824',
  frontColor = '#80CBC4',
  fontSize = defaultFontSize,
  fontWeight = defaultFontWeight,
  ...spanProps
}: ProjectedTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  const objectFactory = useCallback(
    (webScene: WebScene) =>
      webScene.createTextObject(word, fontSize, color, frontColor, fontWeight),
    [color, fontSize, fontWeight, frontColor, word],
  )
  const sceneObject = useProjectedSceneObject(ref, objectFactory)

  useImperativeHandle(interfaceRef, () => ({ sceneObject }), [sceneObject])

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
