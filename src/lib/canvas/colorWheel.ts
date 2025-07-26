import Color from "colorjs.io"
import { map } from "lib/format/numbers"

const BANDS = 4
const STEPS = 8
const SEGMENTS = 30

const outside = {
  lightness: [0.3, 0.85],
  chroma: [0.1, 0.2],
}
const inside = {
  lightness: [0.9, 1],
  chroma: [0.05, 0],
}

export const drawColorWheel = (c: CanvasRenderingContext2D, width: number, height: number) => {
  c.strokeStyle = "white"

  for (let band = 0; band < BANDS; band++) {
    const bandLT = map(band, 0, BANDS - 1, 0, 1) ** 0.8
    const bandL = [
      map(bandLT, 0, 1, outside.lightness[0], inside.lightness[0]),
      map(bandLT, 0, 1, outside.lightness[1], inside.lightness[1]),
    ]
    const bandCT = map(band, 0, BANDS - 1, 0, 1) ** 0.8
    const bandC = [
      map(bandCT, 0, 1, outside.chroma[0], inside.chroma[0]),
      map(bandCT, 0, 1, outside.chroma[1], inside.chroma[1]),
    ]

    for (let step = 0; step < STEPS; step++) {

      const stepLT = map(step, 0, STEPS - 1, 0, 1) ** 0.8
      const lightness = map(stepLT, 0, 1, bandL[0], bandL[1])

      const stepCT = map(step, 0, STEPS - 1, 0, 1)
      const chroma = map(stepCT, 0, 1, bandC[0], bandC[1])

      const radius = map(band * STEPS + step, 0, BANDS * STEPS, width / 2, 0)

      for (let segment = 0; segment < SEGMENTS; segment++) {
        const hue = (segment * 360) / SEGMENTS
        const color = new Color("oklch", [lightness, chroma, hue])
        c.fillStyle = color.to("p3").toString()

        const startAngle = map(segment - 0.5, 0, SEGMENTS, 0, 2 * Math.PI)
        const endAngle = map(segment + 0.5, 0, SEGMENTS, 0, 2 * Math.PI)

        c.beginPath()
        c.moveTo(width / 2, height / 2)
        c.arc(width / 2, height / 2, radius, startAngle, endAngle)
        c.closePath()
        c.fill()
        c.stroke()
      }
    }
  }
}
