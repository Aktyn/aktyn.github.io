import { ViewType } from '../../context/viewContext'
import type { ImageSourceType } from '../../scene-3D/objects/images-gallery'
import { GalleryView } from '../common/GalleryView'

/* eslint-disable @typescript-eslint/no-require-imports */
export function Microcontrollers() {
  return <GalleryView view={ViewType.MICROCONTROLLERS} images={images} />
}

const images: Array<ImageSourceType> = [
  { source: require('../../img/microcontrollers/robot.webp'), color: 0xdddddd },
  require('../../img/microcontrollers/cyclocomputer3.webp') as string,
  require('../../img/microcontrollers/cyclocomputer2.webp') as string,
  { source: require('../../img/microcontrollers/cyclocomputer.webp'), color: 0xaaaaaa },
  { source: require('../../img/microcontrollers/bike-tour-assistant2.webp'), color: 0xdddddd },
  require('../../img/microcontrollers/bike-tour-assistant.webp') as string,
  {
    source: require('../../img/microcontrollers/bike-tour-assistant-mobile2.webp'),
    color: 0xdddddd,
  },
  {
    source: require('../../img/microcontrollers/bike-tour-assistant-mobile.webp'),
    color: 0xdddddd,
  },
]
