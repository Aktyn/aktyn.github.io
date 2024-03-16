import { memo } from 'react'

import './TechnologiesList.scss'

interface TechnologiesListProps {
  technologies: {
    className: string
    tooltip: string
  }[]
}

export const TechnologiesList = memo<TechnologiesListProps>(({ technologies }) => {
  return (
    <div className="technologies">
      <div
        className="text-small text-darken"
        style={{ width: '100%', textAlign: 'center', opacity: 0.5 }}
      >
        Hover over the icons to see the name of the technology
      </div>
      <div className="technologies-list">
        {technologies.map(({ className, tooltip }, index) => (
          <span
            key={className}
            data-tooltip={tooltip}
            data-tooltip-conf="top"
            style={{
              animationDelay: `${2200 + 100 * Math.abs(index - technologies.length / 2)}ms`,
            }}
          >
            <i className={className} />
          </span>
        ))}
      </div>
    </div>
  )
})
