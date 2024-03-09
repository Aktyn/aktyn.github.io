import { useContext } from 'react'
import clsx from 'clsx'
import { Section, SectionContext, sectionNames } from 'context/SectionContext'

import 'common-styles/tooltip.scss'
import './SectionsNavigation.scss'

export const SectionsNavigation = () => {
  const { section: activeSection, setSection } = useContext(SectionContext)

  return (
    <div className="sections-navigation-main">
      <div className="inner-container">
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
          >
            <span data-tooltip={sectionNames[section]} data-tooltip-conf="left" />
          </span>
        ))}
      </div>
    </div>
  )
}
