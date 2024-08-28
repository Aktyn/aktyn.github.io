import { type DependencyList, useCallback, useRef } from 'react'

export function useDebounce<FuncType extends (...args: never[]) => void>(
  func: FuncType,
  delay: number,
  deps: DependencyList = [],
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(
    (...args: Parameters<FuncType>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        func(...args)
      }, delay)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps, delay],
  )
}
