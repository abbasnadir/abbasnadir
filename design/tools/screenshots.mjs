// Takes review screenshots: desktop hero, mobile, reduced motion, full pages.
// Moves the pointer into the hero so the packet wire reacts, and waits for animation frames.
// Usage: node screenshots.mjs <out-dir>
import { mkdirSync } from 'node:fs'
import { BASE, launch } from './browser.mjs'

const out = process.argv[2] || 'screenshots'
mkdirSync(out, { recursive: true })

const jobs = [
  // name, route, width, height, reduced motion, full page
  ['hero', '/', 1366, 860, false, false],
  ['mobile', '/', 390, 844, false, false],
  ['reduced-motion', '/', 1366, 860, true, false],
  ['home-full', '/', 1280, 800, false, true],
  ['case-metricflow-full', '/work/metricflow', 1280, 800, false, true],
  ['case-hangman', '/work/hangman-v2', 1100, 1000, false, false],
]

const browser = await launch()
for (const [name, route, w, h, reduced, full] of jobs) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: reduced ? 'reduce' : 'no-preference' })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(BASE + route)
  await page.mouse.move(w * 0.7, h * 0.4)
  await page.waitForTimeout(2000)
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: full })
  console.log(name, errors.length ? errors : 'ok')
  await page.close()
}
await browser.close()
