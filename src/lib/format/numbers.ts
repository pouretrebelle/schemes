export const map = (
  value: number,
  min1: number,
  max1: number,
  min2: number,
  max2: number,
  clampResult?: boolean
): number => {
  const result = ((value - min1) / (max1 - min1)) * (max2 - min2) + min2
  return clampResult ? clamp(result, min2, max2) : result
}

export const clamp = (value: number, min: number, max: number): number => {
  if (max < min) {
    let temp = min
    min = max
    max = temp
  }

  return Math.max(min, Math.min(value, max))
}

export const wrap = (value: number, min: number, max: number) => {
  let result = value
  const range = max - min
  if (value < min) result += range
  if (value >= max) result -= range
  return result
}

export const wrappedDistance = (
  inputA: number,
  inputB: number,
  min: number,
  max: number
) => {
  const a = wrap(inputA, min, max)
  const b = wrap(inputB, min, max)
  const range = max - min
  const diff = b - a

  if (Math.abs(diff) < range / 2) return diff

  if (diff >= 0) return range - diff

  return -range - diff
}

export const randomFromNoise = (noiseValue: number): number =>
  Math.abs(noiseValue * 10) % 1

export const signFromRandom = (value: number): number => (value > 0.5 ? 1 : -1)

export const signFromNoise = (value: number): number => (value > 0 ? 1 : -1)

export const roundToDecimalPlace = (num: number, degree: number): number =>
  Math.round(num * Math.pow(10, degree)) / Math.pow(10, degree)

export const getStandardDeviation = (array: number[]) => {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  )
}

export const getCircularStandardDeviation = (array: number[]) => {
  let sin = 0
  let cos = 0
  array.forEach((v) => {
    sin += Math.sin(v)
    cos += Math.cos(v)
  })
  sin /= array.length
  cos /= array.length

  return Math.sqrt(-Math.log(sin * sin + cos * cos))
}
