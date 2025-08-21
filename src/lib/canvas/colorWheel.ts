import { swatches } from "lib/data/colorWheel"

export const drawColorWheel = (c: CanvasRenderingContext2D, width: number, height: number) => {
  c.strokeStyle = "white"

  swatches.forEach((swatch, i) => {
    c.fillStyle = swatch.colorP3
    drawSwatchShape(c, swatch, width, height)
    c.fill()
    c.stroke()
  })
}

export const drawSwatchShape = (c: CanvasRenderingContext2D, swatch: typeof swatches[number], width: number, height: number) => {
  c.beginPath()
  c.arc(width / 2, height / 2, swatch.endRadius * (width / 2), swatch.startAngle, swatch.endAngle)
  c.arc(width / 2, height / 2, swatch.startRadius * (width / 2), swatch.endAngle, swatch.startAngle, true)
  c.closePath()
}
