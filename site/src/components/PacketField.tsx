import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks'

// A band under the masthead where packets travel left to right like traffic on a wire.
// Accent packets are pulled toward the pointer; plain ones are pushed away from it.
// Colours come from the --packet and --accent tokens so the canvas follows the CSS palette.

type Packet = {
  x: number
  y: number
  px: number
  py: number
  speed: number
  size: number
  hot: boolean
  seed: number
}

const POINTER_RADIUS = 120

function spawn(w: number, h: number, anywhere: boolean): Packet {
  const x = anywhere ? Math.random() * w : -12
  const y = 8 + Math.random() * (h - 16)
  return {
    x,
    y,
    px: x,
    py: y,
    speed: 0.5 + Math.random() * 1.3,
    size: 1 + Math.random() * 1.4,
    hot: Math.random() < 0.12,
    seed: Math.random() * 1000,
  }
}

export function PacketField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const styles = getComputedStyle(canvas)
    const plain = styles.getPropertyValue('--packet').trim()
    const hot = styles.getPropertyValue('--accent').trim()

    let w = 0
    let h = 0
    let packets: Packet[] = []
    let frame = 0
    let running = false
    let visible = true
    const pointer = { x: -9999, y: -9999 }

    const draw = (p: Packet, tail: number) => {
      ctx.strokeStyle = p.hot ? hot : plain
      ctx.lineWidth = p.size
      ctx.beginPath()
      ctx.moveTo(p.x - tail, p.y - (p.y - p.py) * 5)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of packets) draw(p, p.speed * 6)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = 'round'
      const count = Math.min(220, Math.round((w * h) / 1700))
      packets = Array.from({ length: count }, () => spawn(w, h, true))
      if (reduced) drawStatic()
    }

    const step = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of packets) {
        p.px = p.x
        p.py = p.y
        let vx = p.speed
        let vy = Math.sin(p.x * 0.005 + t * 0.0005 + p.seed) * 0.25

        const dx = p.x - pointer.x
        const dy = p.y - pointer.y
        const dist = Math.hypot(dx, dy)
        if (dist < POINTER_RADIUS && dist > 0.01) {
          const force = (1 - dist / POINTER_RADIUS) * 2
          const dir = p.hot ? -0.7 : 1
          vx += (dx / dist) * force * dir
          vy += (dy / dist) * force * dir
        }

        p.x += vx
        p.y = Math.min(h - 4, Math.max(4, p.y + vy))
        if (p.x > w + 12) Object.assign(p, spawn(w, h, false))
        draw(p, (p.x - p.px) * 6)
      }
      frame = requestAnimationFrame(step)
    }

    const start = () => {
      if (running || reduced || !visible || document.hidden) return
      running = true
      frame = requestAnimationFrame(step)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(canvas)

    canvas.addEventListener('pointermove', onPointer)
    canvas.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    resize()
    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="wire" aria-hidden="true" />
}
