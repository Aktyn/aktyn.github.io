import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function compareArrays<T>(a: T[], b: T[]) {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

export function debounce<ArgsType extends unknown[]>(
  func: (...args: ArgsType) => void,
  delay: number,
) {
  if (delay <= 0) {
    return func
  }

  let timeout: NodeJS.Timeout
  return function (...args: ArgsType) {
    clearTimeout(timeout)
    timeout = setTimeout(func, delay, ...args)
  }
}

export function forceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}
