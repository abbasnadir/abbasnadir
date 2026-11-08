import { useEffect, useId, useState } from 'react'
import type { Diagram, DiagramNode } from '../content'
import { useReducedMotion, useSeen } from '../hooks'

const NODE_W = 180
const NODE_H = 64
const WIDTH = 800

function anchor(from: DiagramNode, to: DiagramNode) {
  const fw = from.w ?? NODE_W
  const tw = to.w ?? NODE_W
  const fc = { x: from.x + fw / 2, y: from.y + NODE_H / 2 }
  const tc = { x: to.x + tw / 2, y: to.y + NODE_H / 2 }
  const dx = tc.x - fc.x
  const dy = tc.y - fc.y
  // Leave from the side facing the target, so lines don't cross their own box.
  if (Math.abs(dx) > Math.abs(dy)) {
    const sx = Math.sign(dx)
    return {
      a: { x: fc.x + (sx * fw) / 2, y: fc.y },
      b: { x: tc.x - (sx * tw) / 2, y: tc.y },
      horizontal: true,
    }
  }
  const sy = Math.sign(dy)
  return {
    a: { x: fc.x, y: fc.y + (sy * NODE_H) / 2 },
    b: { x: tc.x, y: tc.y - (sy * NODE_H) / 2 },
    horizontal: false,
  }
}

function layout(diagram: Diagram, uid: string) {
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]))
  const edges = diagram.edges.map((e, i) => {
    const { a, b, horizontal } = anchor(byId.get(e.from)!, byId.get(e.to)!)
    const off = e.bend ?? 0
    const ox = horizontal ? 0 : off
    const oy = horizontal ? off : 0
    const a2 = { x: a.x + ox, y: a.y + oy }
    const b2 = { x: b.x + ox, y: b.y + oy }
    const mid = horizontal ? (a2.x + b2.x) / 2 : (a2.y + b2.y) / 2
    const d = horizontal
      ? `M${a2.x},${a2.y} C${mid},${a2.y} ${mid},${b2.y} ${b2.x},${b2.y}`
      : `M${a2.x},${a2.y} C${a2.x},${mid} ${b2.x},${mid} ${b2.x},${b2.y}`
    const cx = (a2.x + b2.x) / 2
    const cy = (a2.y + b2.y) / 2
    const labelPos = horizontal
      ? { x: cx, y: cy + (off > 0 ? 20 : -10), anchor: 'middle' as const }
      : { x: cx + (off < 0 ? -10 : 10), y: cy + 4, anchor: off < 0 ? ('end' as const) : ('start' as const) }
    const count = e.both ? 4 : e.hot ? 3 : 2
    return { ...e, id: `${uid}-e${i}`, d, labelPos, count }
  })
  const description = diagram.edges
    .map((e) => `${byId.get(e.from)!.label} to ${byId.get(e.to)!.label}${e.label ? ` (${e.label})` : ''}`)
    .join('; ')
  return { edges, description }
}

function Packets({ edge, scale = 1 }: { edge: ReturnType<typeof layout>['edges'][number]; scale?: number }) {
  return Array.from({ length: edge.count }, (_, k) => {
    const dur = edge.hot ? 2.2 : 3.2
    // Negative begin starts each packet mid-flight, so none sit at (0,0) waiting.
    const begin = -((k * dur) / edge.count)
    const reverse = edge.both && k % 2 === 1
    return (
      <circle key={k} r={(edge.hot ? 3.5 : 2.5) * scale} className={edge.hot && !reverse ? 'packet packet-hot' : 'packet'}>
        <animateMotion
          dur={`${dur}s`}
          begin={`${begin}s`}
          repeatCount="indefinite"
          keyPoints={reverse ? '1;0' : undefined}
          keyTimes={reverse ? '0;1' : undefined}
          calcMode={reverse ? 'linear' : undefined}
        >
          <mpath href={`#${edge.id}`} />
        </animateMotion>
      </circle>
    )
  })
}

// Full diagram for case studies: labelled nodes and edges. Edges draw in once the
// figure scrolls into view, then packets start moving along them.
export function FlowDiagram({ diagram }: { diagram: Diagram }) {
  const uid = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const [ref, seen] = useSeen<HTMLElement>(0.3)
  const [flowing, setFlowing] = useState(false)
  const { edges, description } = layout(diagram, uid)

  useEffect(() => {
    if (!seen || reduced) return
    const t = setTimeout(() => setFlowing(true), 520)
    return () => clearTimeout(t)
  }, [seen, reduced])

  return (
    <figure ref={ref} className={`m-0 rounded-md bg-surface p-4 ${seen || reduced ? 'is-seen' : ''}`}>
      <div className="diagram-scroll">
        <svg
          viewBox={`0 0 ${WIDTH} ${diagram.height}`}
          role="img"
          aria-label={`${diagram.title}: ${description}`}
          className="block h-auto w-full min-w-[620px]"
        >
          <defs>
            <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="diagram-arrow" />
            </marker>
          </defs>

          {edges.map((e) => (
            <g key={e.id}>
              <path
                id={e.id}
                d={e.d}
                pathLength={1}
                className={e.hot ? 'edge edge-hot' : 'edge'}
                markerEnd={seen || reduced ? `url(#${uid}-arrow)` : undefined}
                markerStart={e.both && (seen || reduced) ? `url(#${uid}-arrow)` : undefined}
              />
              {e.label && (
                <text x={e.labelPos.x} y={e.labelPos.y} className="edge-label" textAnchor={e.labelPos.anchor}>
                  {e.label}
                </text>
              )}
              {flowing && <Packets edge={e} />}
            </g>
          ))}

          {diagram.nodes.map((n) => (
            <g key={n.id} transform={`translate(${n.x},${n.y})`} className={n.accent ? 'node node-accent' : 'node'}>
              <rect width={n.w ?? NODE_W} height={NODE_H} rx="6" />
              <text x="16" y="28" className="node-label">
                {n.label}
              </text>
              {n.sub && (
                <text x="16" y="48" className="node-sub">
                  {n.sub}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="mt-3 font-sans text-[0.9375rem] text-muted">{diagram.title}</figcaption>
    </figure>
  )
}

// Shape-only thumbnail of the same architecture: boxes, threads and packets, no text.
// Decorative next to a written summary, so it is hidden from assistive tech.
export function DiagramGlyph({ diagram }: { diagram: Diagram }) {
  const uid = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const [ref, seen] = useSeen<HTMLDivElement>(0.4)
  const { edges } = layout(diagram, uid)

  return (
    <div ref={ref} className={seen || reduced ? 'is-seen' : ''} aria-hidden="true">
      <svg viewBox={`0 0 ${WIDTH} ${diagram.height}`} className="block h-auto w-full">
        {edges.map((e) => (
          <g key={e.id}>
            <path id={e.id} d={e.d} pathLength={1} className={e.hot ? 'edge edge-hot' : 'edge'} style={{ strokeWidth: 4 }} />
            {seen && !reduced && <Packets edge={{ ...e, count: e.hot ? 2 : 1 }} scale={2.6} />}
          </g>
        ))}
        {diagram.nodes.map((n) => (
          <g key={n.id} transform={`translate(${n.x},${n.y})`} className={n.accent ? 'node node-accent' : 'node'}>
            <rect width={n.w ?? NODE_W} height={NODE_H} rx="10" style={{ strokeWidth: 4 }} />
          </g>
        ))}
      </svg>
    </div>
  )
}
