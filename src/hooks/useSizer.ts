import { type RefObject, useEffect, useState } from 'react'

export function useSizer(ref: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }

    const resizeObserver = new ResizeObserver(() => {
      setWidth(element.offsetWidth)
      setHeight(element.offsetHeight)
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [ref])

  return { width, height }
}
