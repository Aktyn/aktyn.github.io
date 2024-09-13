import { ViewType } from '../../context/viewContext'
import type { ImageSourceType } from '../../scene-3D/objects/images-gallery'
import { GalleryView } from '../common/GalleryView'

/* eslint-disable @typescript-eslint/no-require-imports */
export function GameDevelopment() {
  return <GalleryView view={ViewType.GAME_DEVELOPMENT} images={images} />
}

const images: Array<ImageSourceType> = [
  { source: require('../../img/games/zero-g-ball.webp'), color: 0xdddddd },
  require('../../img/games/tetris.webp') as string,
  require('../../img/games/ten-tac-toe.webp') as string,
  require('../../img/games/snake.webp') as string,
  { source: require('../../img/games/kulka-w-tarapatach.webp'), color: 0xdddddd },
  { source: require('../../img/games/berta-snakes.webp'), color: 0xaaaaaa },
  require('../../img/games/avoid-lines.webp') as string,
  require('../../img/games/astro-kulka.webp') as string,
]
