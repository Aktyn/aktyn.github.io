import React from 'react'
import ReactDOM from 'react-dom/client'
import 'common-styles/index.scss'
import Layout from './Layout'

const rootElement = document.getElementById('root')
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <Layout />
    </React.StrictMode>,
  )
}
