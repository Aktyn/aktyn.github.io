import { useMemo } from 'react'

export function useIsTouchDevice() {
  const isTouchDevice = useMemo(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0, [])
  return isTouchDevice
}
