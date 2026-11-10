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
  ['project-hangman-full', '/projects/hangman-v2', 1280, 800, false, true],
  ['project-bwars-full', '/projects/bwars-helper', 1280, 800, false, true],
  ['project-restaurant', '/projects/restaurant-ordering', 1280, 800, false, false],
  ['project-bwars-mobile', '/projects/bwars-helper', 390, 844, false, true],
  ['archive-full', '/archive', 1280, 800, false, true],
  ['archive-mobile', '/archive', 390, 844, false, true],
  ['about-full', '/about', 1280, 800, false, true],
  ['resume-full', '/resume', 1280, 800, false, true],
]

const browser = await launch()
for (const [name, route, w, h, reduced, full] of jobs) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: reduced ? 'reduce' : 'no-preference' })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(BASE + route)
  if (full) {
    // Scroll through once so scroll-triggered drawing (diagrams, timeline) has happened.
    const height = await page.evaluate(() => document.body.scrollHeight)
    for (let y = 0; y < height; y += h / 2) {
      await page.evaluate((top) => window.scrollTo(0, top), y)
      await page.waitForTimeout(120)
    }
    await page.evaluate(() => window.scrollTo(0, 0))
  }
  await page.mouse.move(w * 0.7, h * 0.4)
  await page.waitForTimeout(2000)
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: full })
  console.log(name, errors.length ? errors : 'ok')
  await page.close()
}
await browser.close()
