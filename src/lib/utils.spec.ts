import { clamp, compareArrays, debounce, forceArray } from "./utils"

describe("clamp", () => {
  it("should return the value if it is within the range", () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it("should return the minimum value if the value is less than the minimum", () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })

  it("should return the maximum value if the value is greater than the maximum", () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it("should handle equal min and max values", () => {
    expect(clamp(5, 7, 7)).toBe(7)
  })
})

describe("compareArrays", () => {
  it("should return true for identical arrays", () => {
    expect(compareArrays([1, 2, 3], [1, 2, 3])).toBe(true)
  })

  it("should return false for arrays with different lengths", () => {
    expect(compareArrays([1, 2, 3], [1, 2])).toBe(false)
  })

  it("should return false for arrays with same length but different values", () => {
    expect(compareArrays([1, 2, 3], [1, 2, 4])).toBe(false)
  })

  it("should handle empty arrays", () => {
    expect(compareArrays([], [])).toBe(true)
  })

  it("should work with string arrays", () => {
    expect(compareArrays(["a", "b", "c"], ["a", "b", "c"])).toBe(true)
    expect(compareArrays(["a", "b", "c"], ["a", "b", "d"])).toBe(false)
  })

  it("should work with boolean arrays", () => {
    expect(compareArrays([true, false, true], [true, false, true])).toBe(true)
    expect(compareArrays([true, true, false], [true, false, false])).toBe(false)
  })

  it("should work with object arrays", () => {
    const obj1 = { id: 1 }
    const obj2 = { id: 2 }
    expect(compareArrays([obj1, obj2], [obj1, obj2])).toBe(true)
    expect(compareArrays([obj1, obj2], [obj1, { id: 2 }])).toBe(false)
  })
})

describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("should debounce function calls", () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn(1, 2, 3)
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(50)
    expect(mockFn).not.toHaveBeenCalled()

    debouncedFn(4, 5, 6)
    jest.advanceTimersByTime(50)
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(49)
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith(4, 5, 6)
  })

  it("should immediately call the function if delay is 0 or negative", () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 0)

    expect(debouncedFn).toBe(mockFn)

    const negativeDebouncedFn = debounce(mockFn, -100)
    expect(negativeDebouncedFn).toBe(mockFn)
  })
})

describe("forceArray", () => {
  it("should return an array if the value is an array", () => {
    expect(forceArray([1, 2, 3])).toEqual([1, 2, 3])
  })

  it("should return an array with the value if the value is not an array", () => {
    expect(forceArray(1)).toEqual([1])
  })
})
