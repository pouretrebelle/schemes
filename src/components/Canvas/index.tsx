import React, { useEffect, useRef, useState } from 'react';



import { drawColorWheel } from 'lib/canvas/colorWheel';



import styles from './Canvas.module.css';


const PIXEL_RATIO = 2
const WIDTH = 800
const HEIGHT = 800

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isDrawing, setIsDrawing] = useState(false)

  const updatePixel = (x: number, y: number, colorI: number | null) => {}

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
  }, [])

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const pixelMultiplier = canvas.width / rect.width / PIXEL_RATIO
    const x = Math.floor((event.clientX - rect.left) * pixelMultiplier)
    const y = Math.floor((event.clientY - rect.top) * pixelMultiplier)
    updatePixel(x, y, null)
  }

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const pixelMultiplier = canvas.width / rect.width / PIXEL_RATIO
    const x = Math.floor((event.clientX - rect.left) * pixelMultiplier)
    const y = Math.floor((event.clientY - rect.top) * pixelMultiplier)
    updatePixel(x, y, null)
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
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
    </>
  )
}
