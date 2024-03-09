import { useContext, type FC, type PropsWithChildren } from 'react'
import { mdiChevronDoubleDown, mdiChevronDoubleUp } from '@mdi/js'
import Icon from '@mdi/react'
import clsx from 'clsx'
import { SectionContext, type Section } from 'context/SectionContext'

import 'common-styles/palette.scss'
import 'common-styles/typography.scss'
import './SectionContainer.scss'

export const SectionContainer: FC<PropsWithChildren<{ section: Section }>> = ({
  children,
  section,
}) => {
  const { previousSection, nextSection, isFirstSection, isLastSection } = useContext(SectionContext)

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
      <NavigationButton type="previous" show={!isFirstSection} onClick={previousSection} />
      <NavigationButton type="next" show={!isLastSection} onClick={nextSection} />
    </div>
  )
}

interface NavigationButtonProps {
  type: 'next' | 'previous'
  show: boolean
  onClick: () => void
}

const NavigationButton: FC<NavigationButtonProps> = ({ type, show, onClick }) => {
  return (
    <div className={clsx('navigation-button', type, !show && 'hidden')}>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <div className="text-small text-darken">{type === 'next' ? 'See more' : 'Return'}</div>
        <button className="icon text-darken" onClick={onClick}>
          <Icon path={type === 'next' ? mdiChevronDoubleDown : mdiChevronDoubleUp} size="3rem" />
        </button>
      </div>
    </div>
  )
}
