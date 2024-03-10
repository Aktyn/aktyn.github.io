import 'common-styles/typography.scss'
import { useContext, useMemo } from 'react'
import { mdiAccountHardHat } from '@mdi/js'
import Icon from '@mdi/react'
import { Title } from 'components/common/Title'
import { Gallery } from 'components/image-gallery/Gallery'
import { Section, SectionContext } from 'context/SectionContext'
import bertaSnakesImg from 'img/websites/berta-snakes.png'
import fivemLauncherImg from 'img/websites/fivem-launcher.png'
import in2rpImg from 'img/websites/in2rp.png'
import mapPoiImg from 'img/websites/map-poi.png'
import projectParadiseImg from 'img/websites/project-paradise.png'

import './Websites.scss'

export const Websites = () => {
  const { section } = useContext(SectionContext)

  const paused = section !== Section.WEBSITES

  const delayBase = 200
  const delaySection = 600

  const images = useMemo(
    () => [
      { src: bertaSnakesImg, content: 'Berta Snakes' },
      { src: fivemLauncherImg, content: 'Fivem Launcher' },
      { src: in2rpImg, content: 'In2RP' },
      { src: mapPoiImg, content: 'Map POI' },
      { src: projectParadiseImg, content: 'Project Paradise' },
    ],
    [],
  )

  return (
    <div className="websites-main">
      <Title paused={paused} delay={delayBase}>
        Websites and web applications
      </Title>
      <div className="gallery-container">
        <Gallery images={images} />
      </div>
      <Title paused={paused} delay={delayBase + delaySection * 1}>
        Used technologies
      </Title>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: '1rem' }}
      >
        <Icon path={mdiAccountHardHat} size="8rem" />
        <div className="text-large">Under development</div>
      </div>
    </div>
  )
}
