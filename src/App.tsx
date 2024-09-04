import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BackgroundScene } from './BackgroundScene'
import { Layout } from './Layout'
import { Loader } from './components/common/Loader'
import { ViewContext, ViewType } from './context/viewContext'
import type { Scene3D } from './scene-3D'
import { linearValueUpdate, smoothValueUpdate } from './scene-3D/helpers'
import { scrollAnimationSpeed, wheelStrengthMultiplier } from './utils/consts'
import { clamp } from './utils/math'

const viewsCount = Object.values(ViewType).length

export function App() {
  const targetScrollValue = useRef(0)

  const [ready, setReady] = useState(false)
  const [scrollValue, setScrollValue] = useState(0)
  const [scene, setScene] = useState<Scene3D | null>(null)

  const view = useMemo(() => Object.values(ViewType)[Math.round(scrollValue)], [scrollValue])

  useEffect(() => {
    const slowingDownFactor = 1,
      stickingSpeedFactor = 3,
      velocityEffectMultiplier = 4,
      maxVelocity = 0.5
    let velocity = 0,
      animation = 0,
      last = 0
    const step = (time: number) => {
      const delta = Math.min(1, (time - last) / 1000)
      last = time

      updateTargetScrollValue(delta)
      updateScrollValue(delta)

      animation = requestAnimationFrame(step)
    }

    const updateTargetScrollValue = (delta: number) => {
      if (velocity !== 0) {
        targetScrollValue.current = clamp(
          targetScrollValue.current + velocity * delta * velocityEffectMultiplier,
          0,
          viewsCount - 1,
        )
        if (targetScrollValue.current === 0 || targetScrollValue.current === viewsCount - 1) {
          velocity = 0
        }
      }

      const targetIndex = Math.round(targetScrollValue.current)
      targetScrollValue.current = smoothValueUpdate(
        targetScrollValue.current,
        targetIndex,
        delta * Math.max(0, stickingSpeedFactor * (1 - Math.abs(velocity) / maxVelocity)),
      )

      velocity = linearValueUpdate(velocity, 0, delta * slowingDownFactor)
    }

    const updateScrollValue = (delta: number) => {
      setScrollValue((currentValue) => {
        const diff = targetScrollValue.current - currentValue
        const step = Math.sign(diff) * delta * scrollAnimationSpeed
        if (Math.abs(step) > Math.abs(diff)) {
          return targetScrollValue.current
        }
        return currentValue + step
      })
    }

    const onScroll = (event: WheelEvent) => {
      const deltaY = (event.deltaY / window.innerHeight) * wheelStrengthMultiplier
      if (velocity === 0 || Math.sign(velocity) !== Math.sign(deltaY)) {
        velocity = deltaY
      } else {
        velocity = clamp(velocity + deltaY, -maxVelocity, maxVelocity)
      }
    }

    step(0)

    window.addEventListener('wheel', onScroll)
    return () => {
      window.removeEventListener('wheel', onScroll)
      cancelAnimationFrame(animation)
    }
  }, [])

  const setView = useCallback((view: ViewType) => {
    targetScrollValue.current = Object.values(ViewType).indexOf(view)
  }, [])

  const goTo = useCallback((scrollValue: number) => {
    targetScrollValue.current = scrollValue
  }, [])

  return (
    <ViewContext.Provider value={{ view, setView, scrollValue, goTo, scene, setScene }}>
      <BackgroundScene onLoaded={setReady} />
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
