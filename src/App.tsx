import { useState } from 'react'
import { Background } from './Background'
import { Layout } from './Layout'
import { ViewContext, ViewType } from './context/viewContext'

export function App() {
  const [view, setView] = useState(ViewType.ABOUT)

  return (
    <ViewContext.Provider value={{ view, setView }}>
      <Background />
      <Layout />
    </ViewContext.Provider>
  )
}
