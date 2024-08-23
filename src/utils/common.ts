export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

export function once<ArgsType extends Array<unknown>, ResultType>(
  fn: (...args: ArgsType) => ResultType,
) {
  let result: ResultType
  let executed = false
  return (...args: ArgsType) => {
    if (executed) {
      return result
    }

    if (result === undefined) {
      result = fn(...args)
    }
    executed = true
    return result
  }
}
