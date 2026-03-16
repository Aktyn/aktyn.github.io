import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function mix(left: number, right: number, factor: number) {
  return left + (right - left) * clamp(factor, 0, 1)
}

export function mixColors(left: number, right: number, factor: number) {
  const r = mix(left >> 16, right >> 16, factor)
  const g = mix((left >> 8) & 0xff, (right >> 8) & 0xff, factor)
  const b = mix(left & 0xff, right & 0xff, factor)
  return (r << 16) | (g << 8) | b
}

export function compareArrays<T>(a: T[], b: T[]) {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
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

export function omit<ObjectType extends object, Key extends keyof ObjectType>(
  source: ObjectType,
  ...keys: Key[]
): Omit<ObjectType, Key> {
  const result = { ...source }
  for (const key of keys) {
    delete result[key]
  }
  return result as Omit<ObjectType, Key>
}

export function pick<ObjectType extends object, Key extends keyof ObjectType>(
  source: ObjectType,
  ...keys: Key[]
): Pick<ObjectType, Key> {
  const result = {} as Pick<ObjectType, Key>
  for (const key of keys) {
    if (key in source) {
      result[key] = source[key]
    }
  }
  return result
}

export function calculateLinearlyWeightedAverage(values: number[]) {
  let sum = 0,
    weightsSum = 0
  for (let i = 0; i < values.length; i++) {
    sum += values[i] * (i + 1)
    weightsSum += i + 1
  }

  return weightsSum > 0 ? sum / weightsSum : 0
}
