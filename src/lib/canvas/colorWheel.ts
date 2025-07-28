import Color from "colorjs.io"
import { map } from "lib/format/numbers"

// lightness and chroma steps
const steps = [
  [0.9981, 0.0147],
  [0.9907, 0.016],
  [0.982, 0.0173],
  [0.9726, 0.0187],
  [0.9604, 0.0205],
  [0.9444, 0.0224],
  [0.9212, 0.0251],
  [0.8925, 0.0286],
  [0.8469, 0.0332],
  [0.7704, 0.039],
  [0.6873, 0.0429],
  [0.9641, 0.0597],
  [0.9398, 0.0626],
  [0.9066, 0.0663],
  [0.8627, 0.071],
  [0.8026, 0.0765],
  [0.7186, 0.0824],
  [0.6235, 0.0874],
  [0.5171, 0.0893],
  [0.8893, 0.1231],
  [0.8269, 0.1307],
  [0.746, 0.1384],
  [0.6516, 0.1461],
  [0.544, 0.1531],
  [0.418, 0.1597],
  [0.7812, 0.2139],
  [0.7037, 0.2262],
  [0.595, 0.2434],
  [0.478, 0.2625],
  [0.3526, 0.2828]
].reverse()
const stepsLength = steps.length

const majorHues = [
  100, // yellow
  55, // orange
  23, // red
  300, // purple
  220, // blue
  149, // green
]
const betweenSegments = 5
const segments = majorHues.map((hue, i) => {
  let next = majorHues[(i + 1)] ?? majorHues[0]
  if (next > hue) hue += 360 // wrap around
  const step = (next - hue) / (betweenSegments + 1)
  return Array.from({ length: betweenSegments + 1 }, (_, j) => hue + step * j)
}).flat()
const segmentsLength = segments.length

export const drawColorWheel = (c: CanvasRenderingContext2D, width: number, height: number) => {
  c.strokeStyle = "white"

  steps.forEach(([lightness, chroma], stepI) => {
    const radius = map(stepI, 0, stepsLength+1, width / 2, 0)

    for (let segment = 0; segment < segmentsLength; segment++) {
      const hue = segments[segment]
      const color = new Color("oklch", [lightness, chroma, hue])
      c.fillStyle = color.to("p3").toString()

      const startAngle = map(segment - 0.5, 0, segmentsLength, 0, 2 * Math.PI) - Math.PI / 2
      const endAngle = map(segment + 0.5, 0, segmentsLength, 0, 2 * Math.PI) - Math.PI / 2

      c.beginPath()
      c.moveTo(width / 2, height / 2)
      c.arc(width / 2, height / 2, radius, startAngle, endAngle)
      c.closePath()
      c.fill()
      c.stroke()
    }
  })
}
