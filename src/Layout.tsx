import { mdiFastForward } from '@mdi/js'
import Icon from '@mdi/react'
import { BasicInfo } from 'components/BasicInfo'
import logoFlat from 'img/logo_flat.png'

import './Layout.scss'

function App() {
  return (
    <main className="layout">
      {/* TODO: 3d rotation entry animation */}
      <img src={logoFlat} className="shrink-fade-in" style={{ height: '16rem', width: 'auto' }} />
      <BasicInfo />

      {/* TODO: circular progress counting down to end of initial entry animation */}
      <button className="icon" style={{ position: 'fixed', top: '1rem', right: '1rem' }}>
        <Icon path={mdiFastForward} size="3rem" />
      </button>
    </main>
  )
}

export default App
