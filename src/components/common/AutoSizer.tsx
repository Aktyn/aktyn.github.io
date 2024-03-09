import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useDebounce } from 'hooks/useDebounce'

interface AutoSizerProps {
  children: (size: { width: number; height: number }) => ReactNode
  delay?: number
  absolute?: boolean
}

export const AutoSizer = ({ children, delay = 16, absolute }: AutoSizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  const updateSize = useDebounce(
    () => {
      const boundingBox = containerRef.current?.getBoundingClientRect?.()

      setSize({
        width: boundingBox?.width ?? 0,
        height: boundingBox?.height ?? 0,
      })
    },
    delay,
    [],
  )

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    if ('ResizeObserver' in window) {
      try {
        const tabsObserver = new ResizeObserver(updateSize)
        tabsObserver.observe(containerRef.current)

        return () => {
          tabsObserver.disconnect()
        }
      } catch (e) {
        console.error(e)
      }
    } else {
      updateSize()
    }
  }, [updateSize])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        ...(absolute ? { position: 'absolute', top: 0, left: 0 } : {}),
      }}
    >
      {children(size)}
    </div>
  )
}
