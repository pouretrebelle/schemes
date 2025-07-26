export const hslStringToParts = (hsl: string): [number, number, number] => {
  return hsl
    .match(/hsl\((\d+).+?(\d+).+?(\d+)%\)/)
    ?.slice(1)
    .map((n) => parseInt(n)) as [number, number, number]
}

export const hslToRgb = (
  h: number,
  s: number,
  l: number
): [number, number, number] => {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b

  if (s == 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

export const lerpRgb = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => {
  return [
    Math.round(a[0] * (1 - t) + b[0] * t),
    Math.round(a[1] * (1 - t) + b[1] * t),
    Math.round(a[2] * (1 - t) + b[2] * t),
  ]
}
