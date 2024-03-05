import { useState } from 'react'
import { mdiFastForward } from '@mdi/js'
import Icon from '@mdi/react'
import clsx from 'clsx'
import { BasicInfo } from 'components/BasicInfo'
import logoFlat from 'img/logo_flat.png'

import './Layout.scss'

function App() {
  const [isLogoLoaded, setIsLogoLoaded] = useState(false)

  return (
    <main className="layout">
      <img
        src={logoFlat}
        onLoad={() => setIsLogoLoaded(true)}
        className={clsx('logo-top', isLogoLoaded && 'loaded')}
        style={{ height: '16rem', width: 'auto' }}
      />
      <BasicInfo />

      {/* TODO: circular progress counting down to end of initial entry animation */}
      <button className="icon" style={{ position: 'fixed', top: '1rem', right: '1rem' }}>
        <Icon path={mdiFastForward} size="3rem" />
      </button>
    </main>
  )
}

export default App
