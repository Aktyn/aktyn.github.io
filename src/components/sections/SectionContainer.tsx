import { useContext, type FC, type PropsWithChildren } from 'react'
import { mdiChevronDown } from '@mdi/js'
import Icon from '@mdi/react'
import clsx from 'clsx'
import { SectionContext, sectionNames, type Section } from 'context/SectionContext'

import 'common-styles/palette.scss'
import 'common-styles/typography.scss'
import './SectionContainer.scss'

export const SectionContainer: FC<PropsWithChildren<{ section: Section }>> = ({
  children,
  section,
}) => {
  const { previousSection, nextSection } = useContext(SectionContext)

  return (
    <div
      className={clsx('section-container', section)}
      onWheel={(event) => {
        event.stopPropagation()

        if (event.deltaY > 0) {
          nextSection()
        } else if (event.deltaY < 0) {
          previousSection()
        }
      }}
    >
      <div className="section-content">{children}</div>
      <NavigationButton type="previous" section={section} />
      <NavigationButton type="next" section={section} />
    </div>
  )
}

interface NavigationButtonProps {
  type: 'next' | 'previous'
  section: Section
}

const NavigationButton: FC<NavigationButtonProps> = ({ type, section }) => {
  const { setSection, getNextSection, getPreviousSection } = useContext(SectionContext)

  const targetSection = type === 'next' ? getNextSection(section) : getPreviousSection(section)

  return (
    <div className={clsx('navigation-button', type, !targetSection && 'hidden')}>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <div className="text-small text-darken">{targetSection && sectionNames[targetSection]}</div>
        <button
          className={clsx('icon', 'text-darken', type)}
          disabled={!targetSection}
          onClick={() => targetSection && setSection(targetSection)}
        >
          <Icon path={mdiChevronDown} size="3rem" />
          <Icon path={mdiChevronDown} size="3rem" />
        </button>
      </div>
    </div>
  )
}
