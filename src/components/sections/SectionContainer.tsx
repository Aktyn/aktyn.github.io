import { useContext, type FC, type PropsWithChildren } from 'react'
import { mdiChevronDoubleDown } from '@mdi/js'
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
  const { previousSection, nextSection, isLastSection } = useContext(SectionContext)

  return (
    <div
      className={clsx('section-container', section)}
      onWheel={(event) => {
        if (event.deltaY > 0) {
          nextSection()
        } else if (event.deltaY < 0) {
          previousSection()
        }
      }}
    >
      <div className="section-content">{children}</div>
      <div className={clsx('scroll-down-info', isLastSection && 'hidden')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="text-small text-darken">See more</div>
          <button className="icon text-darken" onClick={nextSection}>
            <Icon path={mdiChevronDoubleDown} size="3rem" />
          </button>
        </div>
      </div>
    </div>
  )
}
