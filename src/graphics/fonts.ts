import { load } from "opentype.js"
import { svgPathToShapePath } from "./graphics-helpers"

const fontVariants = {
  light: "/font/SpaceGrotesk-Light.ttf",
  regular: "/font/SpaceGrotesk-Regular.ttf",
  medium: "/font/SpaceGrotesk-Medium.ttf",
  semibold: "/font/SpaceGrotesk-SemiBold.ttf",
  bold: "/font/SpaceGrotesk-Bold.ttf",
}

type FontWeight = keyof typeof fontVariants

const fontCache = new Map<FontWeight, opentype.Font>()

export async function loadFontShapes(
  text: string,
  fontSize: number,
  weight: FontWeight = "medium",
) {
  let font = fontCache.get(weight)
  if (!font) {
    font = await load(fontVariants[weight])
    if (!font) {
      throw new Error(`Failed to load font ${weight}`)
    }
    fontCache.set(weight, font)
  }

  const shapes = font.getPaths(text, 0, 0, fontSize).flatMap((path) => {
    const shapePath = svgPathToShapePath(path)
    return shapePath.toShapes(true)
  })

  return shapes
}
