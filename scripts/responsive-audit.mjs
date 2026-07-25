/**
 * Viewport overflow audit for CodeQuest UI Lab.
 * Fresh session per page to avoid cross-page nav state (collapsed sidebar, toasts).
 * Usage: node scripts/responsive-audit.mjs
 */
import { chromium } from 'playwright'

const WEB_BASE = process.env.SMOKE_WEB_BASE ?? 'http://127.0.0.1:5001'
const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 720 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'laptop-1366', width: 1366, height: 768 },
  { name: 'laptop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
]
const ZOOMS = [1, 1.25, 1.5]

const STUDENT_PAGES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'study-materials', label: 'Study Materials' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'progress', label: 'Progress' },
  { id: 'jobspy', label: 'Jobs' },
  { id: 'practice-code', label: 'Code Workbench' },
  { id: 'practice-sql', label: 'SQL Practice' },
  { id: 'practice-typing', label: 'Typing Practice' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'roadmapper', label: 'Career Map' },
  { id: 'flow-roadmap', label: 'Flow Path' },
  { id: 'learning-planner', label: 'Learning Planner' },
  { id: 'hub', label: 'Hub' },
]

async function measureOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement
    const body = document.body
    const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth)
    const clientWidth = doc.clientWidth
    const overflowX = scrollWidth - clientWidth
    const offenders = []
    for (const el of document.querySelectorAll('main *, #main-content *')) {
      if (!(el instanceof HTMLElement)) continue
      const style = window.getComputedStyle(el)
      if (style.display === 'none' || style.visibility === 'hidden' || style.position === 'fixed') continue
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) continue
      if (rect.right > clientWidth + 2 || rect.left < -2) {
        const tag = el.tagName.toLowerCase()
        const cls = (el.className && typeof el.className === 'string' ? el.className : '')
          .split(/\s+/)
          .slice(0, 4)
          .join('.')
        offenders.push(`${tag}${cls ? '.' + cls : ''} L=${Math.round(rect.left)} R=${Math.round(rect.right)}`)
        if (offenders.length >= 6) break
      }
    }
    return { overflowX, scrollWidth, clientWidth, offenders }
  })
}

async function enterAndOpen(page, label, width) {
  await page.goto(WEB_BASE, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.evaluate(() => {
    localStorage.setItem('career-portal-token', 'ui-lab-session-token')
    localStorage.setItem(
      'career-portal-user',
      JSON.stringify({
        id: 1,
        email: 'student@codequest.dev',
        full_name: 'Test Student',
        role: 'student',
      }),
    )
    localStorage.setItem('career-portal-demo', '1')
    localStorage.setItem('cq-student-nav-hidden', '0')
  })
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('#main-content', { timeout: 20000 })
  await page.evaluate(() => {
    document.querySelectorAll('[data-sonner-toast]').forEach((el) => el.remove())
  })

  if (width < 1024) {
    await page.getByRole('button', { name: /open menu/i }).click({ force: true })
    await page.waitForTimeout(200)
    const btn = page.locator('aside[role="dialog"]').getByRole('button', { name: label, exact: true })
    await btn.first().evaluate((el) => el.scrollIntoView({ block: 'center' }))
    await btn.first().click({ force: true })
  } else if (label !== 'Dashboard') {
    await page.locator('aside:not([role="dialog"])').getByRole('button', { name: label, exact: true }).click()
  }
  await page.waitForTimeout(500)
  await page.evaluate(() => {
    document.querySelectorAll('[data-sonner-toast]').forEach((el) => el.remove())
  })
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const findings = []

  for (const vp of VIEWPORTS) {
    for (const route of STUDENT_PAGES) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      })
      const page = await context.newPage()
      try {
        await enterAndOpen(page, route.label, vp.width)
        const zooms = vp.width <= 1024 ? ZOOMS : [1]
        for (const zoom of zooms) {
          await page.evaluate((z) => {
            document.documentElement.style.zoom = String(z)
          }, zoom)
          await page.waitForTimeout(100)
          const m = await measureOverflow(page)
          findings.push({
            viewport: vp.name,
            page: route.id,
            zoom,
            status: m.overflowX > 2 ? 'fail' : 'pass',
            overflowX: m.overflowX,
            offenders: m.overflowX > 2 ? m.offenders : [],
          })
        }
      } catch (error) {
        findings.push({
          viewport: vp.name,
          page: route.id,
          zoom: 1,
          status: 'error',
          detail: error instanceof Error ? error.message : String(error),
        })
      } finally {
        await context.close()
      }
    }
  }

  await browser.close()

  const fails = findings.filter((f) => f.status === 'fail' || f.status === 'error')
  const passes = findings.filter((f) => f.status === 'pass')
  const byPage = {}
  for (const f of findings) {
    if (!byPage[f.page]) byPage[f.page] = { pass: 0, fail: 0, error: 0 }
    byPage[f.page][f.status] = (byPage[f.page][f.status] || 0) + 1
  }

  console.log(JSON.stringify({ summary: { pass: passes.length, fail: fails.length }, byPage, fails }, null, 2))
  if (fails.length) process.exitCode = 1
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
