import { useContext, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { ContentLayer } from './components/content/content-layer'
import { SceneContext, SceneProvider } from './components/content/scene-context'
import { CV } from './components/cv/cv'

export function App() {
  const sceneContainerRef = useRef<HTMLDivElement>(null)

  useCvPrinting()

  //TODO: remove this
  useEffect(() => {
    window.print()
  }, [])

  return (
    <div
      className="
        relative h-dvh w-dvw overflow-hidden
        print:hidden
      "
    >
      <div ref={sceneContainerRef} className="pointer-events-none absolute inset-0" />

      <SceneProvider containerRef={sceneContainerRef}>
        <EdgeMask />
        <ContentLayer />
      </SceneProvider>
    </div>
  )
}

/** This component hides edge of the hexagonal grid */
function EdgeMask() {
  const { webGlEnabled } = useContext(SceneContext)

  if (!webGlEnabled) {
    return
  }

  return (
    <div
      className="absolute inset-0 size-full"
      style={{
        backgroundImage: `linear-gradient(
              90deg,
              var(--color-background-visual) 0%,
              var(--color-background-visual) calc(50% - 140dvh),
              transparent calc(50% - 100dvh),
              transparent calc(50% + 100dvh),
              var(--color-background-visual) calc(50% + 140dvh),
              var(--color-background-visual) 100%
              )`,
      }}
    />
  )
}

function useCvPrinting() {
  useEffect(() => {
    const printContainerID = 'print-container'

    const beforePrintHandler = () => {
      const printContainer = document.createElement('div')
      printContainer.id = printContainerID
      document.body.appendChild(printContainer)
      const virtualDiv = document.createElement('div')
      const root = createRoot(virtualDiv)
      flushSync(() => {
        root.render(
          <div id={printContainerID}>
            <CV />
          </div>,
        )
      })
      printContainer.innerHTML = virtualDiv.innerHTML
    }
    const afterPrintHandler = () => {
      const container = document.getElementById(printContainerID)
      if (container) {
        container.remove()
      } else {
        console.warn(`Could not find element with id "${printContainerID}"`)
      }
    }

    window.addEventListener('beforeprint', beforePrintHandler)
    window.addEventListener('afterprint', afterPrintHandler)

    return () => {
      window.removeEventListener('beforeprint', beforePrintHandler)
      window.removeEventListener('afterprint', afterPrintHandler)
    }
  }, [])
}
