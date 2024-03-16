import { useCallback, useEffect, useRef, useState } from 'react'
import { SectionContainer } from 'components/sections/SectionContainer'
import { SectionsNavigation } from 'components/sections/SectionsNavigation'
import { BasicInfo } from 'components/sections/basic-info/BasicInfo'
import { ComputerGraphics } from 'components/sections/computer-graphics/ComputerGraphics'
import { GameDevelopment } from 'components/sections/game-development/GameDevelopment'
import { Microcontrollers } from 'components/sections/microcontrollers/Microcontrollers'
import { Websites } from 'components/sections/websites/Websites'
import { Section, SectionContext, sectionClassNames } from 'context/SectionContext'
import './Layout.scss'

const MINIMUM_SECTION_CHANGE_INTERVAL = 500

function App() {
  const sectionChangeTimestampRef = useRef(0)

  const [section, internalSetSection] = useState(Section.BASIC_INFO)

  const canChangeSection = useCallback(() => {
    return Date.now() - sectionChangeTimestampRef.current >= MINIMUM_SECTION_CHANGE_INTERVAL
  }, [])

  const setSection = useCallback(
    (newSection: Section) => {
      if (!canChangeSection()) {
        return
      }
      sectionChangeTimestampRef.current = Date.now()
      internalSetSection(newSection)
    },
    [canChangeSection],
  )

  const getPreviousSection = useCallback(
    (sourceSection?: Section) => {
      switch (sourceSection ?? section) {
        case Section.WEBSITES:
          return Section.BASIC_INFO
        case Section.GAME_DEVELOPMENT:
          return Section.WEBSITES
        case Section.MICROCONTROLLERS:
          return Section.GAME_DEVELOPMENT
        case Section.COMPUTER_GRAPHICS:
          return Section.MICROCONTROLLERS
      }
      return null
    },
    [section],
  )

  const previousSection = useCallback(() => {
    const previousSection = getPreviousSection()
    if (previousSection) {
      setSection(previousSection)
    }
  }, [getPreviousSection, setSection])

  const getNextSection = useCallback(
    (sourceSection?: Section) => {
      switch (sourceSection ?? section) {
        case Section.BASIC_INFO:
          return Section.WEBSITES
        case Section.WEBSITES:
          return Section.GAME_DEVELOPMENT
        case Section.GAME_DEVELOPMENT:
          return Section.MICROCONTROLLERS
        case Section.MICROCONTROLLERS:
          return Section.COMPUTER_GRAPHICS
      }
      return null
    },
    [section],
  )

  const nextSection = useCallback(() => {
    const nextSection = getNextSection()
    if (nextSection) {
      setSection(nextSection)
    }
  }, [getNextSection, setSection])

  useEffect(() => {
    const sectionContainerElement = document.querySelector(
      `.section-container.${sectionClassNames[section]}`,
    )
    if (!sectionContainerElement) {
      console.error(`Container not found for section: ${section}`)
    }
    sectionContainerElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    let timeoutId: NodeJS.Timeout
    const onWindowResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        sectionContainerElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    }

    window.addEventListener('resize', onWindowResize)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', onWindowResize)
    }
  }, [section])

  return (
    <SectionContext.Provider
      value={{
        section,
        setSection,
        getPreviousSection,
        previousSection,
        getNextSection,
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
