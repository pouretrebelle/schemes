import { swatches } from "lib/data/colorWheel"

export const drawColorWheel = (c: CanvasRenderingContext2D, width: number, height: number) => {
  c.strokeStyle = "white"

  swatches.forEach((swatch, i) => {
    c.fillStyle = swatch.colorP3
    c.beginPath()
    c.arc(width / 2, height / 2, swatch.endRadius * (width / 2), swatch.startAngle, swatch.endAngle)
    c.arc(width / 2, height / 2, swatch.startRadius * (width / 2), swatch.endAngle, swatch.startAngle, true)
    c.closePath()
    c.fill()
    c.stroke()
  })
}
