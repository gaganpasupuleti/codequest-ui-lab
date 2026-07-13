import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = __dirname
const BASE = 'http://localhost:5173/'

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
]

const sections = [
  { id: 'hero', file: 'section-hero' },
  { id: 'how-it-works', file: 'section-quest-journey' },
  { id: 'quest-arenas', file: 'section-quest-arenas' },
  { id: 'platform-showcase', file: 'section-platform-showcase' },
  { id: 'final-cta', file: 'section-final-cta' },
]

async function collectPageMetrics(page) {
  return page.evaluate(() => {
    const doc = document.documentElement
    const body = document.body
    const overflowX = Math.max(doc.scrollWidth, body.scrollWidth) - window.innerWidth
    const offenders = [...document.querySelectorAll('*')]
      .filter((el) => {
        const r = el.getBoundingClientRect()
        return r.right > window.innerWidth + 1 || r.left < -1
      })
      .slice(0, 12)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        className: typeof el.className === 'string' ? el.className.slice(0, 80) : null,
        right: Math.round(el.getBoundingClientRect().right),
      }))

    const heroHeading = document.querySelector('#hero-heading')
    const heroOpacity = heroHeading
      ? getComputedStyle(heroHeading).opacity
      : null

    const scrollTriggers =
      window.gsap?.core?.globals?.ScrollTrigger?.getAll?.()?.length ??
      (window.ScrollTrigger?.getAll?.() ?? []).length

    return {
      overflowX,
      offenders,
      heroOpacity,
      scrollTriggerCount: scrollTriggers,
      pageHeight: doc.scrollHeight,
      title: document.title,
    }
  })
}

async function runViewport(browser, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: 'no-preference',
  })
  const page = await context.newPage()
  const consoleLogs = []
  const consoleErrors = []
  const pageErrors = []

  page.on('console', (msg) => {
    const line = `[${msg.type()}] ${msg.text()}`
    consoleLogs.push(line)
    if (msg.type() === 'error') consoleErrors.push(line)
  })
  page.on('pageerror', (err) => pageErrors.push(String(err)))

  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  const metrics = await collectPageMetrics(page)
  await page.screenshot({
    path: path.join(OUT, `fullpage-${vp.name}.png`),
    fullPage: true,
  })

  for (const section of sections) {
    const el = page.locator(`#${section.id}`)
    if (await el.count()) {
      await el.scrollIntoViewIfNeeded()
      await page.waitForTimeout(400)
      await el.screenshot({ path: path.join(OUT, `${section.file}-${vp.name}.png`) })
    }
  }

  // Scroll journey + arenas for pin state on desktop
  if (vp.width >= 1024) {
    await page.evaluate(() => window.scrollTo(0, 1200))
    await page.waitForTimeout(600)
    await page.screenshot({
      path: path.join(OUT, `pinned-journey-mid-${vp.name}.png`),
      fullPage: false,
    })
    const arenas = page.locator('#quest-arenas')
    await arenas.scrollIntoViewIfNeeded()
    await page.evaluate(() => {
      const el = document.getElementById('quest-arenas')
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, top + 300)
    })
    await page.waitForTimeout(600)
    await page.screenshot({
      path: path.join(OUT, `horizontal-arenas-mid-${vp.name}.png`),
      fullPage: false,
    })
  }

  // Ticker hover pause
  const ticker = page.locator('section[aria-label="Skills and technologies"]')
  if (await ticker.count()) {
    await ticker.hover()
    await page.waitForTimeout(300)
    await ticker.screenshot({ path: path.join(OUT, `ticker-hover-${vp.name}.png`) })
  }

  await context.close()

  return { viewport: vp.name, metrics, consoleErrors, pageErrors, consoleLogs }
}

async function runReducedMotion(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector('#hero-heading')
    const steps = [...document.querySelectorAll('[data-journey-step]')].map((el) =>
      getComputedStyle(el).opacity,
    )
    const bars = [...document.querySelectorAll('[data-progress-bar]')].map(
      (el) => el.style.width || getComputedStyle(el).width,
    )
    const pinned = document.querySelector('.pin-spacer')
    return {
      heroOpacity: hero ? getComputedStyle(hero).opacity : null,
      stepOpacities: steps,
      barWidths: bars,
      hasPinSpacer: Boolean(pinned),
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
    }
  })

  await page.screenshot({
    path: path.join(OUT, 'fullpage-reduced-motion-1440.png'),
    fullPage: true,
  })
  await context.close()
  return metrics
}

async function runKeyboardRoutes(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })

  const ctaHrefs = await page.evaluate(() =>
    [...document.querySelectorAll('a[href], button')]
      .filter((el) => /start your quest|explore|view learning/i.test(el.textContent || ''))
      .map((el) => ({
        text: (el.textContent || '').trim().slice(0, 40),
        tag: el.tagName,
        href: el.getAttribute('href'),
      })),
  )

  await page.keyboard.press('Tab')
  const focusables = []
  for (let i = 0; i < 12; i++) {
    const active = await page.evaluate(() => {
      const el = document.activeElement
      if (!el) return null
      return {
        tag: el.tagName,
        text: (el.textContent || '').trim().slice(0, 40),
        href: el.getAttribute('href'),
        outline: getComputedStyle(el).outlineStyle,
      }
    })
    focusables.push(active)
    await page.keyboard.press('Tab')
  }

  await context.close()
  return { ctaHrefs, focusables }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()

  const results = []
  for (const vp of viewports) {
    results.push(await runViewport(browser, vp))
  }

  const reduced = await runReducedMotion(browser)
  const keyboard = await runKeyboardRoutes(browser)

  await browser.close()

  const report = {
    ranAt: new Date().toISOString(),
    baseUrl: BASE,
    viewportResults: results,
    reducedMotion: reduced,
    keyboard,
  }

  await writeFile(path.join(OUT, 'browser-qa-report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
