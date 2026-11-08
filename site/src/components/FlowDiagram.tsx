import { useId } from 'react'
import type { Diagram, DiagramNode } from '../content'
import { useReducedMotion } from '../hooks'

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

export function FlowDiagram({ diagram }: { diagram: Diagram }) {
  const uid = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]))

  const edges = diagram.edges.map((e, i) => {
    const from = byId.get(e.from)!
    const to = byId.get(e.to)!
    const { a, b, horizontal } = anchor(from, to)
    const off = e.bend ?? 0
    // Offset perpendicular to the main direction so paired edges sit side by side.
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

  return (
    <figure className="diagram">
      <div className="diagram-scroll">
        <svg
          viewBox={`0 0 ${WIDTH} ${diagram.height}`}
          role="img"
          aria-label={`${diagram.title}: ${description}`}
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
                className={e.hot ? 'edge edge-hot' : 'edge'}
                markerEnd={`url(#${uid}-arrow)`}
                markerStart={e.both ? `url(#${uid}-arrow)` : undefined}
              />
              {e.label && (
                <text x={e.labelPos.x} y={e.labelPos.y} className="edge-label" textAnchor={e.labelPos.anchor}>
                  {e.label}
                </text>
              )}
              {!reduced &&
                Array.from({ length: e.count }, (_, k) => {
                  const count = e.count
                  const dur = e.hot ? 2.2 : 3.2
                  // Negative begin starts each packet mid-flight, so none sit at (0,0) waiting.
                  const begin = -((k * dur) / count)
                  const reverse = e.both && k % 2 === 1
                  return (
                    <circle key={k} r={e.hot ? 3.5 : 2.5} className={e.hot && !reverse ? 'packet packet-hot' : 'packet'}>
                      <animateMotion
                        dur={`${dur}s`}
                        begin={`${begin}s`}
                        repeatCount="indefinite"
                        keyPoints={reverse ? '1;0' : undefined}
                        keyTimes={reverse ? '0;1' : undefined}
                        calcMode={reverse ? 'linear' : undefined}
                      >
                        <mpath href={`#${e.id}`} />
                      </animateMotion>
                    </circle>
                  )
                })}
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
      <figcaption>{diagram.title}</figcaption>
    </figure>
  )
}
