// Launches headless Chromium without installing anything into the project.
// Looks for playwright-core in the npx cache and for a Chromium headless shell in the
// Playwright browser cache. Override with PLAYWRIGHT_CORE=/path/to/playwright-core and
// CHROME=/path/to/chrome if either lookup fails. To populate the caches once:
//   npx -y playwright@latest install chromium-headless-shell
import { createRequire } from 'node:module'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

function findPlaywrightCore() {
  if (process.env.PLAYWRIGHT_CORE) return process.env.PLAYWRIGHT_CORE
  const npx = join(process.env.HOME, '.npm/_npx')
  for (const d of existsSync(npx) ? readdirSync(npx) : []) {
    const p = join(npx, d, 'node_modules/playwright-core')
    if (existsSync(p)) return p
  }
  throw new Error('playwright-core not found; run `npx -y playwright@latest --version` once or set PLAYWRIGHT_CORE')
}

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME
  const cache = join(process.env.HOME, '.cache/ms-playwright')
  const shells = (existsSync(cache) ? readdirSync(cache) : []).filter((d) => d.startsWith('chromium_headless_shell-')).sort()
  for (const s of shells.reverse()) {
    const base = join(cache, s)
    const sub = readdirSync(base).find((d) => d.startsWith('chrome-'))
    const exe = sub && join(base, sub, 'chrome-headless-shell')
    if (exe && existsSync(exe)) return exe
  }
  throw new Error('no Chromium headless shell found; run `npx -y playwright@latest install chromium-headless-shell` or set CHROME')
}

export async function launch() {
  const require = createRequire(join(findPlaywrightCore(), 'package.json'))
  const { chromium } = require('playwright-core')
  return chromium.launch({ executablePath: findChrome() })
}

export const BASE = process.env.BASE || 'http://localhost:4317'
