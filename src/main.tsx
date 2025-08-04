import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import { TooltipProvider } from "./components/ui/tooltip"
import { ViewModule } from "./modules/view.module"

import "./index.css"

createRoot(document.getElementById("root") ?? document.body).render(
  <StrictMode>
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <ViewModule.Provider>
        <App />
      </ViewModule.Provider>
    </TooltipProvider>
  </StrictMode>,
)
