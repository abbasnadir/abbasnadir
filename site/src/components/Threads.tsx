import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks'

// The masthead band. Threads run from client nodes (circles) on the left into a hub
// (the accent square) and fan out to service nodes (squares) on the right. Packets
// travel along the threads. Moving the pointer near a thread grabs it; when the pointer
// leaves, the thread snaps back on a stiff, heavily damped spring.
// Colours come from the Tailwind theme tokens so the canvas follows the CSS palette.

const SAMPLES = 72
const GRAB = 22
const SIGMA = 70

type Pt = { x: number; y: number }
type Thread = { base: Pt[]; amp: number; vel: number; grabbed: boolean; gx: number }
type Packet = { thread: number; s: number; speed: number; hot: boolean }

function cubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  }
}

export function Threads() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const css = getComputedStyle(canvas)
    const color = (name: string) => css.getPropertyValue(name).trim()
    const C = {
      thread: color('--rule'),
      packet: color('--packet'),
      accent: color('--accent'),
      paper: color('--paper'),
    }

    let w = 0
    let h = 0
    let lefts: Pt[] = []
    let rights: Pt[] = []
    let hub: Pt = { x: 0, y: 0 }
    let threads: Thread[] = []
    let packets: Packet[] = []
    let frame = 0
    let running = false
    let visible = true
    const pointer = { x: -9999, y: -9999, active: false }

    const build = () => {
      const pad = Math.max(14, w * 0.03)
      const nLeft = w < 640 ? 5 : 7
      lefts = Array.from({ length: nLeft }, (_, i) => ({ x: pad, y: ((i + 0.5) / nLeft) * h }))
      rights = [0.22, 0.5, 0.78].map((f) => ({ x: w - pad, y: f * h }))
      hub = { x: w * 0.58, y: h / 2 }
      threads = lefts.map((l, i) => {
        const r = rights[i % rights.length]
        const base: Pt[] = []
        for (let j = 0; j < SAMPLES; j++) {
          const t = j / (SAMPLES - 1)
          base.push(
            t < 0.5
              ? cubic(l, { x: l.x + (hub.x - l.x) * 0.55, y: l.y }, { x: hub.x - (hub.x - l.x) * 0.3, y: hub.y }, hub, t * 2)
              : cubic(hub, { x: hub.x + (r.x - hub.x) * 0.3, y: hub.y }, { x: r.x - (r.x - hub.x) * 0.55, y: r.y }, r, t * 2 - 1),
          )
        }
        return { base, amp: 0, vel: 0, grabbed: false, gx: hub.x }
      })
      const count = Math.min(44, Math.round(w / 34))
      packets = Array.from({ length: count }, (_, i) => ({
        thread: i % threads.length,
        s: Math.random(),
        speed: 0.0022 + Math.random() * 0.0026,
        hot: Math.random() < 0.18,
      }))
    }

    const pointAt = (th: Thread, s: number): Pt => {
      const f = Math.min(Math.max(s, 0), 1) * (SAMPLES - 1)
      const j = Math.min(Math.floor(f), SAMPLES - 2)
      const k = f - j
      const a = th.base[j]
      const b = th.base[j + 1]
      const x = a.x + (b.x - a.x) * k
      const y = a.y + (b.y - a.y) * k
      return { x, y: y + displacement(th, x) }
    }

    const displacement = (th: Thread, x: number) =>
      th.amp === 0 ? 0 : th.amp * Math.exp(-((x - th.gx) ** 2) / (2 * SIGMA * SIGMA))

    const updateThreads = () => {
      for (const th of threads) {
        // Nearest base sample to the pointer's x tells us where this thread sits under the pointer.
        let near: Pt | null = null
        if (pointer.active) {
          let best = Infinity
          for (const p of th.base) {
            const d = Math.abs(p.x - pointer.x)
            if (d < best) {
              best = d
              near = p
            }
          }
        }
        const dy = near ? pointer.y - near.y : Infinity
        if (near && Math.abs(dy) < GRAB + (th.grabbed ? 18 : 0)) {
          th.grabbed = true
          th.gx = pointer.x
          th.amp += (Math.max(-26, Math.min(26, dy)) - th.amp) * 0.5
          th.vel = 0
        } else {
          th.grabbed = false
          th.vel = th.vel * 0.62 - th.amp * 0.32
          th.amp += th.vel
          if (Math.abs(th.amp) < 0.05 && Math.abs(th.vel) < 0.05) th.amp = th.vel = 0
        }
      }
    }

    const drawNode = (p: Pt, shape: 'circle' | 'square', size: number, stroke: string) => {
      ctx.fillStyle = C.paper
      ctx.strokeStyle = stroke
      ctx.lineWidth = 1.5
      ctx.beginPath()
      if (shape === 'circle') ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
      else ctx.roundRect(p.x - size, p.y - size, size * 2, size * 2, 2)
      ctx.fill()
      ctx.stroke()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1
      ctx.strokeStyle = C.thread
      for (const th of threads) {
        ctx.beginPath()
        for (let j = 0; j < SAMPLES; j++) {
          const p = th.base[j]
          const y = p.y + displacement(th, p.x)
          if (j === 0) ctx.moveTo(p.x, y)
          else ctx.lineTo(p.x, y)
        }
        ctx.stroke()
      }

      ctx.lineCap = 'round'
      for (const pk of packets) {
        const th = threads[pk.thread]
        const head = pointAt(th, pk.s)
        const tail = pointAt(th, pk.s - (pk.hot ? 0.035 : 0.022))
        ctx.strokeStyle = pk.hot ? C.accent : C.packet
        ctx.lineWidth = pk.hot ? 2.4 : 1.8
        ctx.beginPath()
        ctx.moveTo(tail.x, tail.y)
        ctx.lineTo(head.x, head.y)
        ctx.stroke()
      }

      for (const l of lefts) drawNode(l, 'circle', 4.5, C.packet)
      for (const r of rights) drawNode(r, 'square', 5, C.packet)
      drawNode(hub, 'square', 8, C.accent)
    }

    const step = () => {
      updateThreads()
      for (const pk of packets) {
        pk.s += pk.speed
        if (pk.s > 1) {
          pk.s = 0
          pk.thread = Math.floor(Math.random() * threads.length)
          pk.hot = Math.random() < 0.18
        }
      }
      draw()
      frame = requestAnimationFrame(step)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
      draw()
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
      pointer.active = true
    }
    const onLeave = () => {
      pointer.active = false
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
    canvas.addEventListener('pointercancel', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    resize()
    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('pointercancel', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="threads" aria-hidden="true" />
}
