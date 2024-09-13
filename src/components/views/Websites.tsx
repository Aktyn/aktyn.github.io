import { ViewType } from '../../context/viewContext'
import type { ImageSourceType } from '../../scene-3D/objects/images-gallery'
import { GalleryView } from '../common/GalleryView'

/* eslint-disable @typescript-eslint/no-require-imports */
export function Websites() {
  return <GalleryView view={ViewType.WEBSITES} images={images} />
}

const images: Array<ImageSourceType> = [
  { source: require('../../img/websites/berta-snakes.webp'), color: 0xbbbbbb },
  require('../../img/websites/fivem-launcher.webp') as string,
  { source: require('../../img/websites/in2rp.webp'), color: 0xdddddd },
  { source: require('../../img/websites/map-poi.webp'), color: 0x999999 },
  require('../../img/websites/project-paradise.webp') as string,
]
