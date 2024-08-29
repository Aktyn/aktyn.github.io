import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { ViewContext, ViewType } from '../context/viewContext'

import './Navigator.scss'

const gapSizeRem = 1
// const viewsCount = Object.values(ViewType).length

export function Navigator() {
  const innerContainerRef = useRef<HTMLDivElement>(null)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstShow = useRef(true)

  const { view: currentView, setView, scrollValue } = useContext(ViewContext)

  const [hide, setHide] = useState(false)

  const showWidget = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    setHide(false)
    hideTimeoutRef.current = setTimeout(
      () => {
        setHide(true)
        hideTimeoutRef.current = null
      },
      isFirstShow ? 4_000 : 2_000,
    )

    isFirstShow.current = false
  }, [])

  useEffect(() => {
    const innerContainer = innerContainerRef.current

    innerContainer?.addEventListener('mouseover', showWidget)
    return () => {
      innerContainer?.removeEventListener('mouseover', showWidget)
    }
  }, [showWidget])

  useEffect(() => {
    if (typeof scrollValue === 'number') {
      showWidget()
    }
  }, [scrollValue, showWidget])

  return (
    <div className="navigator">
      <div
        ref={innerContainerRef}
        style={{ display: 'flex', flexDirection: 'column', gap: `${gapSizeRem}rem` }}
      >
        {Object.values(ViewType).map((view, index) => {
          const factor = Math.max(0, 1 - Math.abs(index - scrollValue))
          const sizeRem = factor * gapSizeRem * 0.5

          const active = view === currentView

          return (
            <div
              key={index}
              className={clsx(hide && 'hide', active && 'active')}
              onClick={active ? undefined : () => setView(view)}
              style={{
                // transitionDelay: `${Math.abs(index + 1 - viewsCount / 2) * 0.05}s`,
                marginBottom: `-${sizeRem}rem`,
                paddingBottom: `${sizeRem}rem`,
                marginTop: `-${sizeRem}rem`,
                paddingTop: `${sizeRem}rem`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
