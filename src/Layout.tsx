import { useCallback, useEffect, useRef, useState } from 'react'
import { SectionContainer } from 'components/sections/SectionContainer'
import { SectionsNavigation } from 'components/sections/SectionsNavigation'
import { BasicInfo } from 'components/sections/basic-info/BasicInfo'
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

    switch (section) {
      case Section.BASIC_INFO:
        return
      case Section.WEBSITES:
        return setSection(Section.BASIC_INFO)
    }
  }, [canChangeSection, section])

  const nextSection = useCallback(() => {
    if (!canChangeSection()) {
      return
    }

    switch (section) {
      case Section.BASIC_INFO:
        return setSection(Section.WEBSITES)
      case Section.WEBSITES:
        return
    }
  }, [canChangeSection, section])

  useEffect(() => {
    sectionChangeTimestampRef.current = Date.now()

    const sectionContainerElement = document.querySelector(`.section-container.${section}`)
    if (!sectionContainerElement) {
      console.error(`Container not found for section: ${section}`)
    }
    sectionContainerElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [section])

  //TODO: simple dots navigation somewhere at the edge of the screen

  return (
    <SectionContext.Provider
      value={{
        section,
        setSection,
        previousSection,
        nextSection,
        isFirstSection: section === Section.BASIC_INFO,
        isLastSection: section === Section.WEBSITES,
      }}
    >
      <main className="layout">
        <SectionContainer section={Section.BASIC_INFO}>
          <BasicInfo />
        </SectionContainer>
        <SectionContainer section={Section.WEBSITES}>
          <Websites />
        </SectionContainer>

        <SectionsNavigation />
      </main>
    </SectionContext.Provider>
  )
}

export default App
