import { useCallback, useEffect, useState, type FC, type PropsWithChildren } from 'react'
import { mdiFullscreenExit } from '@mdi/js'
import Icon from '@mdi/react'
import clsx from 'clsx'
import { createPortal } from 'react-dom'

import './Maximizable.scss'

const CLOSING_DURATION = 600

export const Maximizable: FC<PropsWithChildren<{ maximized: boolean; onClose: () => void }>> = ({
  children,
  maximized,
  onClose,
}) => {
  const rootElement = useState(document.getElementById('root'))[0]
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (maximized) {
      setClosing(false)
    }
  }, [maximized])

  const startClosing = useCallback(() => {
    setClosing(true)

    const timeout = setTimeout(() => {
      onClose()
      clearTimeout(timeout)
    }, CLOSING_DURATION)

    return () => clearTimeout(timeout)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (maximized) {
    return (
      rootElement && (
        <>
          {children}
          {createPortal(
            <div className={clsx('maximized', { closing })}>
              {children}
              <button className="icon" onClick={startClosing}>
                <Icon path={mdiFullscreenExit} size="1.5rem" />
              </button>
            </div>,
            rootElement,
          )}
        </>
      )
    )
  }
  return children
}
