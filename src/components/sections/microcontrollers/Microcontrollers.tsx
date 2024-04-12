import { useContext } from 'react'
import { RepositoryInfo } from 'components/common/RepositoryInfo'
import { TechnologiesList } from 'components/common/TechnologiesList'
import { Title } from 'components/common/Title'
import { Gallery } from 'components/image-gallery/Gallery'
import { Section, SectionContext } from 'context/SectionContext'
import bikeTourAssistantMobileImg from 'img/microcontrollers/bike-tour-assistant-mobile.webp'
import bikeTourAssistantMobile2Img from 'img/microcontrollers/bike-tour-assistant-mobile2.webp'
import bikeTourAssistantImg from 'img/microcontrollers/bike-tour-assistant.webp'
import bikeTourAssistant2Img from 'img/microcontrollers/bike-tour-assistant2.webp'
import cyclocomputerImg from 'img/microcontrollers/cyclocomputer.webp'
import cyclocomputer2Img from 'img/microcontrollers/cyclocomputer2.webp'
import cyclocomputer3Img from 'img/microcontrollers/cyclocomputer3.webp'
import robotImg from 'img/microcontrollers/robot.webp'

import 'common-styles/typography.scss'
import 'devicon/devicon.min.css'
import './Microcontrollers.scss'

export const Microcontrollers = () => {
  const { section } = useContext(SectionContext)

  const paused = section !== Section.MICROCONTROLLERS

  const delayBase = 200
  const delaySection = 600

  return (
    <div className="microcontrollers-main">
      <Title paused={paused} delay={delayBase}>
        Microcontroller-based inventions
      </Title>
      <div className="gallery-container">
        <Gallery images={images} />
      </div>
      <Title paused={paused} delay={delayBase + delaySection * 1}>
        Used technologies
      </Title>
      <TechnologiesList technologies={technologies} />
    </div>
  )
}

const CyclocomputerInfo = () => (
  <RepositoryInfo link="https://github.com/Aktyn/Cyclocomputer-raspberry-pi-pico">
    Project created to help me on my bike trips. For maximum energy efficiency it uses an e-Paper
    display module that shows the current speed and a simplified map with the plotted route and some
    additional information like temperature, wind direction, etc.
  </RepositoryInfo>
)

const BikeTourAssistantInfo = () => (
  <RepositoryInfo link="https://github.com/Aktyn/Bike-Tour-Assistant">
    The next iteration of my previous bike project. This time I&apos;ve used a LCD module and a
    Raspberry Pi camera to take photos every 500 meters.
  </RepositoryInfo>
)

const images = [
  { src: bikeTourAssistantMobileImg, content: <BikeTourAssistantInfo /> },
  { src: bikeTourAssistantMobile2Img, content: <BikeTourAssistantInfo /> },
  { src: bikeTourAssistantImg, content: <BikeTourAssistantInfo /> },
  { src: bikeTourAssistant2Img, content: <BikeTourAssistantInfo /> },
  {
    src: robotImg,
    content: (
      <RepositoryInfo link="https://github.com/Aktyn/Protaktyn">
        Experiment with autonomous robot build with Raspberry Pi and simple webcam.
      </RepositoryInfo>
    ),
  },
  { src: cyclocomputerImg, content: <CyclocomputerInfo /> },
  { src: cyclocomputer2Img, content: <CyclocomputerInfo /> },
  { src: cyclocomputer3Img, content: <CyclocomputerInfo /> },
]

const technologies = [
  { className: 'devicon-python-plain colored', tooltip: 'Python' },
  { className: 'devicon-cplusplus-plain colored', tooltip: 'C and C++' },
  { className: 'devicon-raspberrypi-plain colored', tooltip: 'Raspberry Pi' },
  { className: 'devicon-android-plain colored', tooltip: 'Android' },
  { className: 'devicon-react-original colored', tooltip: 'React Native' },
]
