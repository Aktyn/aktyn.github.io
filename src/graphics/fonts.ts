import { load } from 'opentype.js'
import { svgPathToShapePath } from './graphics-helpers'

const fontVariants = {
  light: '/font/SpaceGrotesk-Light.ttf',
  regular: '/font/SpaceGrotesk-Regular.ttf',
  medium: '/font/SpaceGrotesk-Medium.ttf',
  semibold: '/font/SpaceGrotesk-SemiBold.ttf',
  bold: '/font/SpaceGrotesk-Bold.ttf',
}

export const fontWeightValues: { [key in FontWeight]: number } = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}

export type FontWeight = keyof typeof fontVariants

const fontCache = new Map<
  FontWeight,
  { promise: Promise<opentype.Font>; resolved: opentype.Font | null }
>()

export async function loadFontShapes(
  text: string,
  fontSize: number,
  weight: FontWeight = 'medium',
) {
  let fontPromise = fontCache.get(weight)
  if (!fontPromise) {
    fontPromise = { promise: load(fontVariants[weight]), resolved: null }
    fontCache.set(weight, fontPromise)
  }

  const font = fontPromise.resolved || (await fontPromise.promise)
  if (!font) {
    throw new Error(`Failed to load font ${weight}`)
  }

  if (!fontPromise.resolved) {
    fontPromise.resolved = font
    fontCache.set(weight, fontPromise)
  }

  const shapes = font.getPaths(text, 0, 0, fontSize).flatMap((path) => {
    const shapePath = svgPathToShapePath(path)
    return shapePath.toShapes(true)
  })

  return shapes
}

export function getFontMetrics(weight: FontWeight) {
  const font = fontCache.get(weight)?.resolved
  if (!font) {
    return null
  }
  return {
    ascender: font.ascender,
    descender: font.descender,
    unitsPerEm: font.unitsPerEm,
  }
}
