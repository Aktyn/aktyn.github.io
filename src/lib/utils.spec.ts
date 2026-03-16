import { describe, it, expect, mock, beforeEach, afterEach, jest } from 'bun:test'
import {
  calculateLinearlyWeightedAverage,
  clamp,
  compareArrays,
  debounce,
  forceArray,
  mix,
  mixColors,
  omit,
  pick,
} from './utils'

describe(clamp, () => {
  it('should return the value if it is within the range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it('should return the minimum value if the value is less than the minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })

  it('should return the maximum value if the value is greater than the maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('should handle equal min and max values', () => {
    expect(clamp(5, 7, 7)).toBe(7)
  })
})

describe(compareArrays, () => {
  it('should return true for identical arrays', () => {
    expect(compareArrays([1, 2, 3], [1, 2, 3])).toBe(true)
  })

  it('should return false for arrays with different lengths', () => {
    expect(compareArrays([1, 2, 3], [1, 2])).toBe(false)
  })

  it('should return false for arrays with same length but different values', () => {
    expect(compareArrays([1, 2, 3], [1, 2, 4])).toBe(false)
  })

  it('should handle empty arrays', () => {
    expect(compareArrays([], [])).toBe(true)
  })

  it('should work with string arrays', () => {
    expect(compareArrays(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true)
    expect(compareArrays(['a', 'b', 'c'], ['a', 'b', 'd'])).toBe(false)
  })

  it('should work with boolean arrays', () => {
    expect(compareArrays([true, false, true], [true, false, true])).toBe(true)
    expect(compareArrays([true, true, false], [true, false, false])).toBe(false)
  })

  it('should work with object arrays', () => {
    const obj1 = { id: 1 }
    const obj2 = { id: 2 }
    expect(compareArrays([obj1, obj2], [obj1, obj2])).toBe(true)
    expect(compareArrays([obj1, obj2], [obj1, { id: 2 }])).toBe(false)
  })
})

describe(debounce, () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should debounce function calls', () => {
    const mockFn = mock(() => {})
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn()
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(50)
    expect(mockFn).not.toHaveBeenCalled()

    debouncedFn()
    jest.advanceTimersByTime(50)
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(49)
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should immediately call the function if delay is 0 or negative', () => {
    const mockFn = mock(() => {})
    const debouncedFn = debounce(mockFn, 0)

    expect(debouncedFn).toBe(mockFn)

    const negativeDebouncedFn = debounce(mockFn, -100)
    expect(negativeDebouncedFn).toBe(mockFn)
  })
})

describe(forceArray, () => {
  it('should return an array if the value is an array', () => {
    expect(forceArray([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('should return an array with the value if the value is not an array', () => {
    expect(forceArray(1)).toEqual([1])
  })
})

describe(calculateLinearlyWeightedAverage, () => {
  it('should calculate the linearly weighted average correctly', () => {
    expect(calculateLinearlyWeightedAverage([1, 2, 3])).toBeCloseTo(2.333333333333333)
  })

  it('should return 0 for an empty array', () => {
    expect(calculateLinearlyWeightedAverage([])).toBe(0)
  })
})

describe(mix, () => {
  it('should return left value when factor is 0', () => {
    expect(mix(10, 20, 0)).toBe(10)
  })

  it('should return right value when factor is 1', () => {
    expect(mix(10, 20, 1)).toBe(20)
  })

  it('should return middle value when factor is 0.5', () => {
    expect(mix(10, 20, 0.5)).toBe(15)
  })

  it('should clamp factor to 0-1 range', () => {
    expect(mix(10, 20, -1)).toBe(10)
    expect(mix(10, 20, 2)).toBe(20)
  })
})

describe(mixColors, () => {
  it('should return left color when factor is 0', () => {
    expect(mixColors(0xff0000, 0x0000ff, 0)).toBe(0xff0000)
  })

  it('should return right color when factor is 1', () => {
    expect(mixColors(0xff0000, 0x0000ff, 1)).toBe(0x0000ff)
  })

  it('should mix colors correctly when factor is 0.5', () => {
    expect(mixColors(0xff0000, 0x0000ff, 0.5)).toBe(0x7f007f)
  })

  it('should clamp factor to 0-1 range', () => {
    expect(mixColors(0xff0000, 0x0000ff, -1)).toBe(0xff0000)
    expect(mixColors(0xff0000, 0x0000ff, 2)).toBe(0x0000ff)
  })
})

describe(omit, () => {
  it('should omit specified keys from an object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(omit(obj, 'a', 'c')).toEqual({ b: 2 })
  })

  it('should return a new object', () => {
    const obj = { a: 1, b: 2 }
    const result = omit(obj, 'a')
    expect(result).not.toBe(obj)
    expect(result).toEqual({ b: 2 })
  })

  it('should ignore keys that do not exist', () => {
    const obj = { a: 1, b: 2 }
    // @ts-expect-error key 'c' does not exist but testing runtime behavior
    expect(omit(obj, 'c')).toEqual({ a: 1, b: 2 })
  })
})

describe(pick, () => {
  it('should pick specified keys from an object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(pick(obj, 'a', 'c')).toEqual({ a: 1, c: 3 })
  })

  it('should return a new object', () => {
    const obj = { a: 1, b: 2 }
    const result = pick(obj, 'a')
    expect(result).not.toBe(obj)
    expect(result).toEqual({ a: 1 })
  })

  it('should ignore keys that do not exist', () => {
    const obj = { a: 1, b: 2 }
    // @ts-expect-error key 'c' does not exist but testing runtime behavior
    expect(pick(obj, 'a', 'c')).toEqual({ a: 1 })
  })
})
