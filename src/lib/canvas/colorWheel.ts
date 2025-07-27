import Color from "colorjs.io"
import { map } from "lib/format/numbers"

const STEPS = [4, 5, 8, 12]

const MAJOR_HUES = [
  100, // yellow
  55, // orange
  23, // red
  300, // purple
  220, // blue
  149, // green
]
const betweenSegments = 5
const hues = MAJOR_HUES.map((hue, i) => {
  let next = MAJOR_HUES[(i + 1)] ?? MAJOR_HUES[0]
  if (next > hue) hue += 360 // wrap around
  const step = (next - hue) / (betweenSegments + 1)
  return Array.from({ length: betweenSegments + 1 }, (_, j) => hue + step * j)
}).flat()
const segments = hues.length

const outside = {
  lightness: [0.1, 0.8],
  chroma: [0.4, 0.3],
}
const inside = {
  lightness: [0.5, 1],
  chroma: [0.03, 0],
}

export const drawColorWheel = (c: CanvasRenderingContext2D, width: number, height: number) => {
  c.strokeStyle = "white"
  const bands = STEPS.length
  const totalSteps = STEPS.reduce((sum, s) => sum + s, 0)
  let drawnSteps = 0

  for (let band = 0; band < bands; band++) {
    const bandLT = map(band + 0.5, 0, bands, 0, 1)
    const bandL = [
      map(bandLT, 0, 1, outside.lightness[0], inside.lightness[0]),
      map(bandLT, 0, 1, outside.lightness[1], inside.lightness[1]),
    ]
    const bandCT = map(band + 0.5, 0, bands, 0, 1) ** 0.6
    const bandC = [
      map(bandCT, 0, 1, outside.chroma[0], inside.chroma[0]),
      map(bandCT, 0, 1, outside.chroma[1], inside.chroma[1]),
    ]

    const bandSteps = STEPS[band]
    for (let step = 0; step < bandSteps; step++) {

      const stepLT = map(step + 0.5, 0, bandSteps, 0, 1) ** map(band, 0, bands - 1, 0.8, 0.3)
      const lightness = map(stepLT, 0, 1, bandL[0], bandL[1])

      const stepCT = map(step + 0.5, 0, bandSteps, 0, 1)
      const chroma = map(stepCT, 0, 1, bandC[0], bandC[1])

      const radius = map(drawnSteps, 0, totalSteps, width / 2, 0)

      for (let segment = 0; segment < segments; segment++) {
        const hue = hues[segment]
        const color = new Color("oklch", [lightness, chroma, hue])
        c.fillStyle = color.to("p3").toString()

        const startAngle = map(segment - 0.5, 0, segments, 0, 2 * Math.PI) - Math.PI / 2
        const endAngle = map(segment + 0.5, 0, segments, 0, 2 * Math.PI) - Math.PI / 2

        c.beginPath()
        c.moveTo(width / 2, height / 2)
        c.arc(width / 2, height / 2, radius, startAngle, endAngle)
        c.closePath()
        c.fill()
        c.stroke()
      }
      drawnSteps++
    }
  }
}
