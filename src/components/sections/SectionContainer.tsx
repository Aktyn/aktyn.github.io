import { useContext, useEffect, useRef, type FC, type PropsWithChildren } from 'react'
import { mdiChevronDown } from '@mdi/js'
import Icon from '@mdi/react'
import clsx from 'clsx'
import {
  SectionContext,
  sectionClassNames,
  sectionNames,
  type Section,
} from 'context/SectionContext'

import 'common-styles/palette.scss'
import 'common-styles/typography.scss'
import './SectionContainer.scss'

export const SectionContainer: FC<PropsWithChildren<{ section: Section }>> = ({
  children,
  section,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { section: activeSection, previousSection, nextSection } = useContext(SectionContext)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    let touchY = 0
    const threshold = 128

    const handleVerticalMove = (delta: number) => {
      if (delta > 0) {
        nextSection()
      } else if (delta < 0) {
        previousSection()
      }
    }

    const handleWheel = (event: WheelEvent) => {
      event.stopPropagation()
      handleVerticalMove(event.deltaY)
    }
    const handleTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0].clientY
    }
    const handleTouchMove = (event: TouchEvent) => {
      event.stopPropagation()
      const y = event.touches[0].clientY
      const delta = touchY - y
      if (Math.abs(delta) >= threshold) {
        handleVerticalMove(delta)
        touchY = y
      }
    }

    container.addEventListener('wheel', handleWheel, true)
    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove)

    return () => {
      container.removeEventListener('wheel', handleWheel, true)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
    }
  }, [nextSection, previousSection])

  return (
    <div
      ref={containerRef}
      className={clsx(
        'section-container',
        sectionClassNames[section],
        activeSection === section && 'section-active',
      )}
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
        style={{
          display: 'flex',
          flexDirection: type === 'next' ? 'column-reverse' : 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
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
