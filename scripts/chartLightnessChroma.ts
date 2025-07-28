
// use script on a canvas to draw a slice of hue on the oklch spectrum

import Color from "colorjs.io"
import { map } from "lib/format/numbers"

const unit = 5
export const drawLightnessChromaGrid = (c: CanvasRenderingContext2D, width: number, height: number) => {
  for (let w = 0; w < width; w += unit) {
    for (let h = 0; h < height; h += unit) {
      const lightness = map(w, 0, width, 0, 1)
      const chroma = map(h, 0, height, 0, 0.4)
      const color = new Color("oklch", [lightness, chroma, 100])
      c.fillStyle = color.to("p3").toString()
      c.fillRect(w, h, unit, unit)
    }
  }
}

// use above canvas in Figma, draw lines over it to describe bands for the colour wheel
// https://www.figma.com/design/h1kZa6z0zCYc1bFOtIrH1F/Scratchpad?node-id=2671-65&t=U5jNwxPyfF3Fwmzm-0

// use script in RunJS with svg output from Figma to extract lightness and chroma values

const svg = `
`

const formatVal = (v, scale) => {
  const v1 = parseFloat(v) * scale
  return ~~(v1 * 1000) / 10000
}

const matches = ([...svg.matchAll(/path d="M(.+?)"/g)]).map(m => {
  return m[1].split('L')
}).flat().map(m => {
  const [x, y] = m.split(' ')

  return [formatVal(x, 0.01), formatVal(y, 0.004)]
})

return matches
