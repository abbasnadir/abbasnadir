// Captures the Hangman V2 multiplayer setup screen from the live site for the project page.
// Signs in as a guest, which creates an anonymous user in the game's Supabase project.
// Usage: node capture-hangman.mjs   (writes site/public/img/hangman-setup.png)
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { launch } from './browser.mjs'

const out = join(dirname(fileURLToPath(import.meta.url)), '../../site/public/img/hangman-setup.png')
mkdirSync(dirname(out), { recursive: true })

const browser = await launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 })
await page.goto('https://hangman.abbasnadir.tech', { waitUntil: 'networkidle', timeout: 45000 })
await page.getByText(/play as guest/i).click()
await page.getByText(/^multiplayer$/i).click({ timeout: 20000 })
await page.getByRole('button', { name: /^\s*play\s*$/i }).waitFor({ timeout: 20000 })
await page.waitForLoadState('networkidle')
await page.waitForTimeout(800)
// Crop to the title and the setup panel (680 by 600 CSS px, 1360 by 1200 in the file).
await page.screenshot({ path: out, clip: { x: 300, y: 100, width: 680, height: 600 } })
console.log(`wrote ${out}`)
await browser.close()
