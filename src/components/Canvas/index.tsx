import React, { useEffect, useRef, useState } from 'react'

import { drawColorWheel, drawSwatchShape } from 'lib/canvas/colorWheel'
import { swatches } from 'lib/data/colorWheel'
import { clamp, map, wrap } from 'lib/format/numbers'

import styles from './Canvas.module.css'

const PIXEL_RATIO = 2
const WIDTH = 800
const HEIGHT = 800

type Highlight = {
  swatchI: number
  level: 1 | 2 | 3
  x: number
  y: number
}

const getHighlightRadius = (h: Highlight) => {
  return 5 + h.level * 12
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
    highlights.forEach((h) => {
      const { swatchI, x, y } = h
      const swatch = swatches[swatchI]
      if (!swatch) return

      c.fillStyle = swatch.colorP3
      c.strokeStyle = 'hsla(0, 0%, 0%, 0.2)'
      c.lineWidth = 2
      c.shadowColor = 'hsla(0, 0%, 0%, 0.5)'
      c.shadowBlur = 15
      c.beginPath()
      c.arc(
        map(x, -1, 1, 0, WIDTH),
        map(y, -1, 1, 0, HEIGHT),
        getHighlightRadius(h),
        0,
        2 * Math.PI
      )
      c.closePath()
      c.stroke()
      c.fill()
    })
    c.restore()

    // draw average
    if (highlights.length > 0) {
      let runningX = 0
      let runningY = 0
      highlights.forEach(({ swatchI, level, x, y }) => {
        const swatch = swatches[swatchI]
        if (!swatch) return

        let multiplier = 0.1
        if (level === 2) multiplier = 0.3
        if (level === 3) multiplier = 0.6

        runningX += x * multiplier
        runningY += y * multiplier
      })

      const border = 6
      const size = 5
      c.save()
      c.lineWidth = 3
      c.strokeStyle = 'red'
      c.translate(
        clamp(map(runningX, -1, 1, 0, WIDTH), border, WIDTH - border),
        clamp(map(runningY, -1, 1, 0, HEIGHT), border, HEIGHT - border),
      )
      c.beginPath()
      c.moveTo(-size, -size)
      c.lineTo(size, size)
      c.moveTo(size, -size)
      c.lineTo(-size, size)
      c.closePath()
      c.stroke()
      c.restore()
    }
  }, [highlights])

  const incrementHighlight = (highlight: Highlight) => {
    // turn off when at max level
    if (highlight?.level === 3) {
      setHighlights(highlights.filter((h) => h.swatchI !== highlight.swatchI))
    }
    // increment level
    else {
      setHighlights(
        highlights.map((h) =>
          h.swatchI === highlight.swatchI
            ? { ...h, level: (h.level + 1) as 1 | 2 | 3 }
            : h
        )
      )
    }
  }

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

    // check highlight hit
    if (highlights.length > 0) {
      // reverse array so top highlight is checked first
      const hit = highlights
        .slice()
        .reverse()
        .find((h) => {
          const hitRadius = getHighlightRadius(h)
          const hitX = map(h.x, -1, 1, 0, WIDTH)
          const hitY = map(h.y, -1, 1, 0, HEIGHT)
          const distance = Math.sqrt(
            (hitX - event.clientX) ** 2 + (hitY - event.clientY) ** 2
          )
          return distance <= hitRadius
        })
      if (hit) {
        incrementHighlight(hit)
        return
      }
    }

    // find swatch hit
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
      const highlight = highlights.find((h) => h.swatchI === swatch.index)
      if (highlight) {
        incrementHighlight(highlight)
      } else {
        // add new highlight
        setHighlights([
          ...highlights,
          { swatchI: swatch.index, level: 1, x, y },
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
