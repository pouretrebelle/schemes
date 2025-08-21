import React, { useEffect, useRef, useState } from 'react';



import { drawColorWheel, drawSwatchShape } from 'lib/canvas/colorWheel';
import { swatches } from 'lib/data/colorWheel';
import { clamp, map, wrap } from 'lib/format/numbers';



import styles from './Canvas.module.css';


const PIXEL_RATIO = 2
const WIDTH = 800
const HEIGHT = 800

type Highlight = {
  index: number
  level: 1 | 2 | 3
}

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [highlights, setHighlights] = useState<Highlight[]>([])

  useEffect(() => {
    const c = canvasRef.current?.getContext('2d', {
      colorSpace: 'display-p3',
    }) as CanvasRenderingContext2D

    // work even if double mounted
    c.restore()
    c.save()

    c.scale(PIXEL_RATIO, PIXEL_RATIO)
  }, [])

  useEffect(() => {
    const c = canvasRef.current?.getContext('2d', {
      colorSpace: 'display-p3',
    }) as CanvasRenderingContext2D

    c.clearRect(0, 0, WIDTH, HEIGHT)

    // draw
    drawColorWheel(c, WIDTH, HEIGHT)

    // draw highlights
    c.save()
    highlights.forEach(({ index, level }) => {
      const swatch = swatches[index]
      if (!swatch) return

      c.strokeStyle = 'black'
      c.lineWidth = level
      drawSwatchShape(c, swatch, WIDTH, HEIGHT)
      c.stroke()
    })
    c.restore()

    // draw average
    if (highlights.length > 0) {
      let runningX = 0
      let runningY = 0
      highlights.forEach(({ index, level }) => {
        const swatch = swatches[index]
        if (!swatch) return

        let midAngle = (swatch.startAngle + swatch.endAngle) / 2
        if (swatch.endAngle < swatch.startAngle) {
          // segment wraps around 0
          midAngle = 0
        }
        let midRadius = (swatch.startRadius + swatch.endRadius) / 2

        let multiplier = 0.1
        if (level === 2) multiplier = 0.3
        if (level === 3) multiplier = 0.6

        runningX += Math.cos(midAngle) * midRadius * multiplier
        runningY += Math.sin(midAngle) * midRadius * multiplier
      })

      const border = 10
      c.save()
      c.lineWidth = 4
      c.strokeStyle = 'red'
      c.beginPath()
      c.arc(
        clamp(map(runningX, -1, 1, 0, WIDTH), border, WIDTH - border),
        clamp(map(runningY, -1, 1, 0, HEIGHT), border, HEIGHT - border),
        5,
        0,
        2 * Math.PI
      )
      c.closePath()
      c.stroke()
      c.restore()
    }
  }, [highlights])

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const pixelMultiplier = canvas.width / rect.width / PIXEL_RATIO
    const x = map(
      Math.floor((event.clientX - rect.left) * pixelMultiplier),
      0,
      rect.width * pixelMultiplier,
      -1,
      1
    )
    const y = map(
      Math.floor((event.clientY - rect.top) * pixelMultiplier),
      0,
      rect.height * pixelMultiplier,
      -1,
      1
    )
    const angle = wrap(Math.atan2(y, x), 0, 2 * Math.PI)
    const radius = Math.sqrt(x * x + y * y)

    const swatch = swatches.find((s) => {
      let hitAngle = s.startAngle <= angle && s.endAngle >= angle
      if (s.endAngle < s.startAngle) {
        // segment wraps around 0
        hitAngle = angle <= s.endAngle || angle >= s.startAngle
      }

      let hitRadius = s.startRadius >= radius && s.endRadius <= radius

      return hitRadius && hitAngle
    })

    if (swatch) {
      const highlight = highlights.find((h) => h.index === swatch.index)
      // turn off when at max level
      if (highlight?.level === 3) {
        setHighlights(highlights.filter((h) => h.index !== swatch.index))
      }
      // increment level
      else if (highlight) {
        setHighlights(
          highlights.map((h) =>
            h.index === swatch.index
              ? { ...h, level: ((h.level + 1) as 1 | 2 | 3) }
              : h
          )
        )
      }
      // add new highlight
      else {
        setHighlights([
          ...highlights,
          { index: swatch.index, level: 1 },
        ])
      }
    }
  }

  return (
    <>
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        width={WIDTH * PIXEL_RATIO}
        height={HEIGHT * PIXEL_RATIO}
        style={
          {
            width: WIDTH,
            height: HEIGHT,
          } as React.CSSProperties
        }
        onClick={handleClick}
      />
    </>
  )
}
