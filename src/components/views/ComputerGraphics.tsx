import { ViewType } from '../../context/viewContext'
import type { ImageSourceType } from '../../scene-3D/objects/images-gallery'
import { GalleryView } from '../common/GalleryView'

/* eslint-disable @typescript-eslint/no-require-imports */
export function ComputerGraphics() {
  return <GalleryView view={ViewType.COMPUTER_GRAPHICS} images={images} />
}

const images: Array<ImageSourceType> = [
  { source: require('../../img/computer-graphics/table-tennis.webp'), color: 0xdddddd },
  { source: require('../../img/computer-graphics/sniadanko.webp'), color: 0xdddddd },
  { source: require('../../img/computer-graphics/psyduck.webp'), color: 0xaaaaaa },
  { source: require('../../img/computer-graphics/old_ball.webp'), color: 0xdddddd },
  { source: require('../../img/computer-graphics/neon_logo_wallpaper.webp'), color: 0xdddddd },
  {
    source: require('../../img/computer-graphics/hairy-logo-v1-postprocess.webp'),
    color: 0xdddddd,
  },
  { source: require('../../img/computer-graphics/fafik_2.webp'), color: 0xdddddd },
]
