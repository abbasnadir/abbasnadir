import type { CSSProperties } from 'react'
import type { Job } from '../content'
import { useSeen } from '../hooks'

// Experience as a real sequence: a thread runs down the left edge and each role is a node on it.
// The current role is an accent square; past roles are circles.
export function Timeline({ jobs }: { jobs: Job[] }) {
  const [ref, seen] = useSeen<HTMLOListElement>(0.15)

  return (
    <ol ref={ref} className={`relative mt-6 ${seen ? 'is-seen' : ''}`}>
      <span aria-hidden="true" className="timeline-thread absolute top-2 bottom-2 left-[5px] w-px bg-packet" />
      {jobs.map((job, i) => {
        const current = job.when.endsWith('now')
        return (
          <li key={job.title} className="relative pb-8 pl-9 last:pb-0">
            <span
              aria-hidden="true"
              style={{ '--i': i } as CSSProperties}
              className={`timeline-node absolute top-[0.45em] left-0 size-[11px] border-[1.5px] bg-paper ${
                current ? 'rounded-[2px] border-accent' : 'rounded-full border-packet'
              }`}
            />
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4">
              <h3 className="text-lg">{job.title}</h3>
              <p className="font-sans text-[0.9375rem] whitespace-nowrap text-muted tabular-nums">{job.when}</p>
            </div>
            <p className="text-muted">{job.org}</p>
            {job.points.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-muted">
                {job.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ol>
  )
}
