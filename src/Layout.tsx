import { useCallback, useEffect, useRef, useState } from 'react'
import { SectionContainer } from 'components/sections/SectionContainer'
import { SectionsNavigation } from 'components/sections/SectionsNavigation'
import { BasicInfo } from 'components/sections/basic-info/BasicInfo'
import { ComputerGraphics } from 'components/sections/computer-graphics/ComputerGraphics'
import { GameDevelopment } from 'components/sections/game-development/GameDevelopment'
import { Microcontrollers } from 'components/sections/microcontrollers/Microcontrollers'
import { Websites } from 'components/sections/websites/Websites'
import { Section, SectionContext } from 'context/SectionContext'
import './Layout.scss'

const MINIMUM_SECTION_CHANGE_INTERVAL = 500

function App() {
  const sectionChangeTimestampRef = useRef(0)

  const [section, setSection] = useState(Section.BASIC_INFO)

  const canChangeSection = useCallback(() => {
    return Date.now() - sectionChangeTimestampRef.current >= MINIMUM_SECTION_CHANGE_INTERVAL
  }, [])

  const previousSection = useCallback(() => {
    if (!canChangeSection()) {
      return
    }
    sectionChangeTimestampRef.current = Date.now()

    switch (section) {
      case Section.BASIC_INFO:
        return
      case Section.WEBSITES:
        return setSection(Section.BASIC_INFO)
      case Section.GAME_DEVELOPMENT:
        return setSection(Section.WEBSITES)
      case Section.MICROCONTROLLERS:
        return setSection(Section.GAME_DEVELOPMENT)
      case Section.COMPUTER_GRAPHICS:
        return setSection(Section.MICROCONTROLLERS)
    }
  }, [canChangeSection, section])

  const nextSection = useCallback(() => {
    if (!canChangeSection()) {
      return
    }
    sectionChangeTimestampRef.current = Date.now()

    switch (section) {
      case Section.BASIC_INFO:
        return setSection(Section.WEBSITES)
      case Section.WEBSITES:
        return setSection(Section.GAME_DEVELOPMENT)
      case Section.GAME_DEVELOPMENT:
        return setSection(Section.MICROCONTROLLERS)
      case Section.MICROCONTROLLERS:
        return setSection(Section.COMPUTER_GRAPHICS)
      case Section.COMPUTER_GRAPHICS:
        return
    }
  }, [canChangeSection, section])

  useEffect(() => {
    const sectionContainerElement = document.querySelector(`.section-container.${section}`)
    if (!sectionContainerElement) {
      console.error(`Container not found for section: ${section}`)
    }
    sectionContainerElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [section])

  return (
    <SectionContext.Provider
      value={{
        section,
        setSection,
        previousSection,
        nextSection,
        isFirstSection: section === Section.BASIC_INFO,
        isLastSection: section === Section.COMPUTER_GRAPHICS,
      }}
    >
      <main className="layout">
        <SectionContainer section={Section.BASIC_INFO}>
          <BasicInfo />
        </SectionContainer>
        <SectionContainer section={Section.WEBSITES}>
          <Websites />
        </SectionContainer>
        <SectionContainer section={Section.GAME_DEVELOPMENT}>
          <GameDevelopment />
        </SectionContainer>
        <SectionContainer section={Section.MICROCONTROLLERS}>
          <Microcontrollers />
        </SectionContainer>
        <SectionContainer section={Section.COMPUTER_GRAPHICS}>
          <ComputerGraphics />
        </SectionContainer>
      </main>
      <SectionsNavigation />
    </SectionContext.Provider>
  )
}

export default App
