import { useState } from 'react'
import { Background } from './Background'
import { Layout } from './Layout'
import { Loader } from './components/common/Loader'
import { ViewContext, ViewType } from './context/viewContext'

export function App() {
  const [view, setView] = useState(ViewType.ABOUT)
  const [ready, setReady] = useState(false)

  return (
    <ViewContext.Provider value={{ view, setView }}>
      <Background onLoaded={setReady} />
      {ready ? (
        <Layout />
      ) : (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loader size="4rem" />
        </div>
      )}
    </ViewContext.Provider>
  )
}
