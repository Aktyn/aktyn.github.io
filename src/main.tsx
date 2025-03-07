import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { TooltipProvider } from "./components/ui/tooltip"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <App />
    </TooltipProvider>
  </StrictMode>,
)
