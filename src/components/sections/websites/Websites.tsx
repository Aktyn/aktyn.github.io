import { useContext } from 'react'
import { RepositoryInfo } from 'components/common/RepositoryInfo'
import { TechnologiesList } from 'components/common/TechnologiesList'
import { Title } from 'components/common/Title'
import { Gallery } from 'components/image-gallery/Gallery'
import { Section, SectionContext } from 'context/SectionContext'
import bertaSnakesImg from 'img/websites/berta-snakes.webp'
import fivemLauncherImg from 'img/websites/fivem-launcher.webp'
import in2rpImg from 'img/websites/in2rp.webp'
import mapPoiImg from 'img/websites/map-poi.webp'
import projectParadiseImg from 'img/websites/project-paradise.webp'

import 'common-styles/tooltip.scss'
import 'common-styles/typography.scss'
import 'devicon/devicon.min.css'
import './Websites.scss'

export const Websites = () => {
  const { section } = useContext(SectionContext)

  const paused = section !== Section.WEBSITES

  const delayBase = 200
  const delaySection = 600

  return (
    <div className="websites-main">
      <Title paused={paused} delay={delayBase}>
        Websites and web applications
      </Title>
      <div className="gallery-container">
        <Gallery images={images} />
      </div>
      <Title paused={paused} delay={delayBase + delaySection * 1}>
        Some of technologies used in my web projects
      </Title>
      <TechnologiesList technologies={technologies} />
    </div>
  )
}

const images = [
  {
    src: bertaSnakesImg,
    content: (
      <RepositoryInfo link="https://github.com/Aktyn/BertaSnakes">
        Website for my online multiplayer browser game: <strong>Berta Snakes</strong>
      </RepositoryInfo>
    ),
  },
  {
    src: fivemLauncherImg,
    content: (
      <RepositoryInfo link="https://github.com/Aktyn/fivem-launcher">
        Electron based FiveM client launcher
      </RepositoryInfo>
    ),
  },
  {
    src: in2rpImg,
    content: (
      <RepositoryInfo link="https://github.com/Aktyn/in2rp_homepage">
        Website for GTA V roleplay server: <strong>In2RP</strong>
      </RepositoryInfo>
    ),
  },
  {
    src: mapPoiImg,
    content: (
      <RepositoryInfo link="https://github.com/Aktyn/React-Map-POI">
        Project created for recruitment process
      </RepositoryInfo>
    ),
  },
  {
    src: projectParadiseImg,
    content: (
      <RepositoryInfo link="https://github.com/Aktyn/ProjectParadise">
        Stylish website for another GTA V roleplay server: <strong>Project Paradise</strong>
      </RepositoryInfo>
    ),
  },
]

const technologies = [
  { className: 'devicon-html5-plain colored', tooltip: 'HTML5' },
  { className: 'devicon-css3-plain colored', tooltip: 'CSS3' },
  { className: 'devicon-sass-plain colored', tooltip: 'Sass' },
  { className: 'devicon-tailwindcss-plain colored', tooltip: 'Tailwind' },
  { className: 'devicon-typescript-plain colored', tooltip: 'TypeScript' },
  { className: 'devicon-react-plain colored', tooltip: 'React' },
  { className: 'devicon-jest-plain colored', tooltip: 'Jest' },
  { className: 'devicon-nodejs-plain colored', tooltip: 'Node.js' },
  { className: 'devicon-electron-original colored', tooltip: 'Electron' },
]
