import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { TooltipProvider } from '~/components/common/tooltip'

import './index.css'

createRoot(document.getElementById('root') ?? document.body).render(
  <StrictMode>
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <App />
    </TooltipProvider>
  </StrictMode>,
)
