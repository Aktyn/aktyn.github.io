import { useContext } from 'react'
import { mdiChevronDoubleDown, mdiChevronDoubleUp } from '@mdi/js'
import Icon from '@mdi/react'
import clsx from 'clsx'
import { ViewContext } from '../../context/viewContext'
import './AdjacentViewNavigationButton.scss'

type AdjacentViewNavigationButtonProps = {
  variant: 'previous' | 'next'
  show: boolean
}

export function AdjacentViewNavigationButton({ variant, show }: AdjacentViewNavigationButtonProps) {
  const { scrollValue, goTo } = useContext(ViewContext)

  return (
    <div className={clsx('adjacent-view-navigation-button', variant, show && 'show')}>
      <button
        onClick={() => {
          if (show) {
            goTo(Math.round(scrollValue) + (variant === 'previous' ? -1 : 1))
          }
        }}
      >
        <Icon path={variant === 'previous' ? mdiChevronDoubleUp : mdiChevronDoubleDown} />
        <span className="info">Go {variant === 'previous' ? 'back' : 'to next view'}</span>
      </button>
    </div>
  )
}
