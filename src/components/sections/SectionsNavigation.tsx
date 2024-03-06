import { useContext } from 'react'
import clsx from 'clsx'
import { Section, SectionContext } from 'context/SectionContext'

import './SectionsNavigation.scss'

export const SectionsNavigation = () => {
  const { section: activeSection, setSection } = useContext(SectionContext)

  return (
    <div className="sections-navigation-main">
      {Object.values(Section).map((section) => (
        <span
          key={section}
          className={clsx(section === activeSection && 'active')}
          onClick={() => {
            if (section === activeSection) {
              return
            }
            setSection(section)
          }}
        />
      ))}
    </div>
  )
}
