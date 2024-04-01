import { useContext } from 'react'
import { TechnologiesList } from 'components/common/TechnologiesList'
import { Title } from 'components/common/Title'
import { Gallery } from 'components/image-gallery/Gallery'
import { Section, SectionContext } from 'context/SectionContext'
import fafikImg from 'img/computer-graphics/fafik_2.webp'
import hairyLogo from 'img/computer-graphics/hairy-logo-v1-postprocess.webp'
import neonLogoImg from 'img/computer-graphics/neon_logo_wallpaper.webp'
import oldBallImg from 'img/computer-graphics/old_ball.webp'
import psyduck from 'img/computer-graphics/psyduck.webp'
import sniadankoImg from 'img/computer-graphics/sniadanko.webp'
import tableTennisImg from 'img/computer-graphics/table-tennis.webp'

import 'devicon/devicon.min.css'
import 'common-styles/typography.scss'
import './ComputerGraphics.scss'

export const ComputerGraphics = () => {
  const { section } = useContext(SectionContext)

  const paused = section !== Section.COMPUTER_GRAPHICS

  const delayBase = 200
  const delaySection = 600

  return (
    <div className="computer-graphics-main">
      <Title paused={paused} delay={delayBase}>
        Graphics projects
      </Title>
      <div className="gallery-container">
        <Gallery images={images} />
      </div>
      <Title paused={paused} delay={delayBase + delaySection * 1}>
        For my graphics I&apos;m using mostly Blender and Gimp
      </Title>
      <TechnologiesList technologies={technologies} />
    </div>
  )
}

const images = [
  { src: sniadankoImg, content: null },
  { src: tableTennisImg, content: null },
  { src: oldBallImg, content: null },
  { src: fafikImg, content: null },
  { src: psyduck, content: null },
  { src: hairyLogo, content: null },
  { src: neonLogoImg, content: null },
]

const technologies = [
  { className: 'devicon-blender-original colored', tooltip: 'Blender' },
  { className: 'devicon-gimp-plain colored', tooltip: 'Gimp' },
  //
]
