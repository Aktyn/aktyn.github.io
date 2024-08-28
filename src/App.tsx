import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Background } from './Background'
import { Layout } from './Layout'
import { Loader } from './components/common/Loader'
import { ViewContext, ViewType } from './context/viewContext'
import { useDebounce } from './hooks/useDebounce'
import { scrollAnimationSpeed, wheelStrengthMultiplier } from './utils/consts'
import { clamp } from './utils/math'

const viewsCount = Object.values(ViewType).length

export function App() {
  const targetScrollValue = useRef(0)

  const [ready, setReady] = useState(false)
  const [scrollValue, setScrollValue] = useState(0)

  const view = useMemo(() => Object.values(ViewType)[Math.round(scrollValue)], [scrollValue])

  const adjustScrollDebounced = useDebounce(
    () => {
      const targetIndex = Math.round(targetScrollValue.current)
      targetScrollValue.current = targetIndex
    },
    500,
    [],
  )

  useEffect(() => {
    const onScroll = (event: WheelEvent) => {
      targetScrollValue.current = clamp(
        targetScrollValue.current + (event.deltaY / window.innerHeight) * wheelStrengthMultiplier,
        0,
        viewsCount - 1,
      )
      adjustScrollDebounced()
    }

    window.addEventListener('wheel', onScroll)
    return () => {
      window.removeEventListener('wheel', onScroll)
    }
  }, [adjustScrollDebounced])

  useEffect(() => {
    let animation = 0,
      last = 0
    const tick = (time: number) => {
      const delta = Math.min(1, (time - last) / 1000)
      last = time

      setScrollValue((currentValue) => {
        const diff = targetScrollValue.current - currentValue
        const step = Math.sign(diff) * delta * scrollAnimationSpeed
        if (Math.abs(step) > Math.abs(diff)) {
          return targetScrollValue.current
        }
        return currentValue + step
      })

      animation = requestAnimationFrame(tick)
    }
    tick(0)

    return () => {
      cancelAnimationFrame(animation)
    }
  }, [])

  const setView = useCallback((view: ViewType) => {
    targetScrollValue.current = Object.values(ViewType).indexOf(view)
  }, [])

  return (
    <ViewContext.Provider value={{ view, setView, scrollValue }}>
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
