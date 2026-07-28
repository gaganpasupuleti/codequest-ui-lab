/**
 * Editorial landing page smoke: renders the public landing view, checks anchor targets,
 * overflow at the required viewports, the login hand-off, and captures QA screenshots.
 * Run against an already-serving dev/preview server: SMOKE_WEB_BASE=http://127.0.0.1:5003
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const WEB_BASE = process.env.SMOKE_WEB_BASE ?? 'http://127.0.0.1:5003'
const ARTIFACT_DIR =
  process.env.SMOKE_ARTIFACT_DIR ?? path.join('qa-artifacts', 'resume-matcher-codequest-landing')

const VIEWPORTS = [
  { label: '1440x900', width: 1440, height: 900 },
  { label: '1366x768', width: 1366, height: 768 },
  { label: '1024x768', width: 1024, height: 768 },
  { label: '768x1024', width: 768, height: 1024 },
  { label: '430x932', width: 430, height: 932 },
  { label: '390x844', width: 390, height: 844 },
  { label: '360x800', width: 360, height: 800 },
]

const REQUIRED_SECTION_IDS = [
  'hero',
  'pain',
  'why-codequest',
  'journey',
  'features',
  'showcase',
  'final-cta',
]

async function loadLanding(page) {
  await page.goto(`${WEB_BASE}/`, { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.locator('.landing-cinematic').first().waitFor({ state: 'visible', timeout: 30000 })
  await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 30000 })
  await page.evaluate(() => window.scrollTo(0, 0))
}

async function scrollThroughPage(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.75)
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 90))
    }
    window.scrollTo(0, document.body.scrollHeight)
    await new Promise((resolve) => setTimeout(resolve, 400))
  })
}

async function main() {
  await mkdir(ARTIFACT_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  const consoleErrors = []
  const pageErrors = []
  const failedRequests = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('response', (response) => {
    if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`)
  })
  page.on('requestfailed', (request) => {
    failedRequests.push(`failed ${request.url()} (${request.failure()?.errorText ?? 'unknown'})`)
  })

  const result = {
    base: WEB_BASE,
    viewports: [],
    checks: {},
    consoleErrors,
    pageErrors,
    failedRequests,
  }

  try {
    // 1. Structure + accessibility basics at desktop.
    await page.setViewportSize({ width: 1440, height: 900 })
    await loadLanding(page)
    await page.waitForTimeout(1800)

    // Nothing in the hero may be left mid-animation once the timeline has settled.
    result.checks.heroSettled = await page.evaluate(() => {
      const targets = Array.from(
        document.querySelectorAll('#hero [data-hero-node], #hero .landing-btn, #hero h1, #hero p'),
      )
      const faded = targets.filter((node) => {
        const style = window.getComputedStyle(node)
        return Number(style.opacity) < 0.95 || style.visibility === 'hidden'
      })
      return { checked: targets.length, faded: faded.length }
    })

    result.checks.h1Count = await page.locator('main h1').count()
    result.checks.h1Text = (await page.getByRole('heading', { level: 1 }).first().innerText()).trim()

    const navLinkHrefs = await page.locator('header nav a[href^="#"]').evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('href')),
    )
    result.checks.navLinkHrefs = navLinkHrefs

    const missingSections = []
    for (const id of REQUIRED_SECTION_IDS) {
      const exists = await page.locator(`#${id}`).count()
      if (!exists) missingSections.push(id)
    }
    result.checks.missingSections = missingSections

    const brokenNavTargets = []
    for (const href of navLinkHrefs) {
      const id = href.replace('#', '')
      const exists = await page.locator(`#${id}`).count()
      if (!exists) brokenNavTargets.push(href)
    }
    result.checks.brokenNavTargets = brokenNavTargets

    result.checks.marqueeAccessibleCopies = await page
      .locator('.landing-marquee p.sr-only')
      .count()
    result.checks.marqueeHiddenTrackAriaHidden = await page
      .locator('.landing-marquee-track')
      .first()
      .getAttribute('aria-hidden')

    // 2. Anchor navigation actually moves the viewport to the section.
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.locator('header nav a[href="#journey"]').first().click()
    await page.waitForTimeout(1200)
    result.checks.journeyAnchorScroll = await page.evaluate(() => {
      const section = document.getElementById('journey')
      if (!section) return null
      const box = section.getBoundingClientRect()
      return { scrollY: Math.round(window.scrollY), sectionTop: Math.round(box.top) }
    })

    // 3. Lazy showcase mounts once scrolled into view.
    await scrollThroughPage(page)
    result.checks.showcaseTabCount = await page.locator('[role="tab"]').count()
    result.checks.showcasePanelVisible = await page
      .locator('[role="tabpanel"]')
      .first()
      .isVisible()
      .catch(() => false)

    // 4. Screenshots + overflow across every required viewport.
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await loadLanding(page)
      // Long enough for the hero entrance timeline to settle before measuring/capturing.
      await page.waitForTimeout(1800)

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }))

      const ctaAboveFold = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('#hero .landing-btn'))
        return buttons.every((button) => {
          const box = button.getBoundingClientRect()
          return box.top >= 0 && box.bottom <= window.innerHeight
        })
      })

      if (viewport.label === '1440x900' || viewport.label === '390x844') {
        const prefix = viewport.width >= 1024 ? 'desktop' : 'mobile'
        await page.screenshot({
          path: path.join(ARTIFACT_DIR, `${prefix}-hero-${viewport.label}.png`),
        })
        await scrollThroughPage(page)
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForTimeout(500)
        await page.screenshot({
          path: path.join(ARTIFACT_DIR, `${prefix}-full-${viewport.label}.png`),
          fullPage: true,
        })
      }

      result.viewports.push({
        ...viewport,
        horizontalOverflowPx: overflow.scrollWidth - overflow.innerWidth,
        heroCtasAboveFold: ctaAboveFold,
      })
    }

    // 4b. Per-section desktop captures for review.
    await page.setViewportSize({ width: 1440, height: 900 })
    await loadLanding(page)
    await scrollThroughPage(page)
    for (const id of REQUIRED_SECTION_IDS) {
      const section = page.locator(`#${id}`)
      if (!(await section.count())) continue
      await section.scrollIntoViewIfNeeded()
      await page.waitForTimeout(700)
      await section.screenshot({ path: path.join(ARTIFACT_DIR, `desktop-section-${id}.png`) })
    }

    // 5. Login hand-off from each CTA entry point.
    const ctaChecks = {}

    await page.setViewportSize({ width: 1440, height: 900 })
    await loadLanding(page)
    await page.getByRole('button', { name: 'Log In', exact: true }).first().click()
    ctaChecks.navLogIn = await page
      .getByRole('main', { name: 'Sign in to CodeQuest' })
      .isVisible()
      .catch(() => false)

    await loadLanding(page)
    await page.locator('#hero').getByRole('button', { name: /Start Your Quest/ }).first().click()
    ctaChecks.heroStartQuest = await page
      .getByRole('main', { name: 'Sign in to CodeQuest' })
      .isVisible()
      .catch(() => false)

    await loadLanding(page)
    await page.locator('#final-cta').scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    await page
      .locator('#final-cta')
      .getByRole('button', { name: 'Fine, Show Me the Platform' })
      .click()
    ctaChecks.finalCtaSecondary = await page
      .getByRole('main', { name: 'Sign in to CodeQuest' })
      .isVisible()
      .catch(() => false)

    await loadLanding(page)
    await page.getByRole('navigation', { name: 'Footer' }).getByRole('button', { name: 'Login' }).click()
    ctaChecks.footerLogin = await page
      .getByRole('main', { name: 'Sign in to CodeQuest' })
      .isVisible()
      .catch(() => false)

    result.checks.ctaLoginHandoff = ctaChecks

    // 6. Mobile menu keyboard + escape behaviour.
    await page.setViewportSize({ width: 360, height: 800 })
    await loadLanding(page)
    const toggle = page.getByRole('button', { name: 'Open navigation menu' })
    await toggle.click()
    const menuVisible = await page.locator('#landing-mobile-menu').isVisible()
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
    const menuClosed = (await page.locator('#landing-mobile-menu').count()) === 0
    const focusReturned = await page.evaluate(
      () => document.activeElement?.getAttribute('aria-controls') === 'landing-mobile-menu',
    )
    result.checks.mobileMenu = { menuVisible, menuClosed, focusReturned }

    // 7. Reduced-motion pass: content must be fully readable.
    const reducedContext = await browser.newContext({ reducedMotion: 'reduce' })
    const reducedPage = await reducedContext.newPage()
    await reducedPage.setViewportSize({ width: 1440, height: 900 })
    await reducedPage.goto(`${WEB_BASE}/`, { waitUntil: 'domcontentloaded', timeout: 120000 })
    await reducedPage.locator('#hero').waitFor({ state: 'visible', timeout: 30000 })
    await reducedPage.waitForTimeout(800)
    result.checks.reducedMotion = await reducedPage.evaluate(() => {
      const targets = Array.from(
        document.querySelectorAll('#hero h1, #hero p, #pain h2, #pain article'),
      )
      const hidden = targets.filter((node) => {
        const style = window.getComputedStyle(node)
        return (
          style.visibility === 'hidden' || Number(style.opacity) < 0.9 || style.display === 'none'
        )
      })
      return { checked: targets.length, hiddenOrFaded: hidden.length }
    })
    await reducedPage.screenshot({
      path: path.join(ARTIFACT_DIR, 'desktop-reduced-motion-1440x900.png'),
    })
    await reducedContext.close()

    console.log(JSON.stringify({ status: 'pass', ...result }, null, 2))
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          status: 'fail',
          error: error instanceof Error ? error.message : String(error),
          ...result,
        },
        null,
        2,
      ),
    )
    process.exitCode = 1
  } finally {
    await browser.close()
  }
}

void main()
