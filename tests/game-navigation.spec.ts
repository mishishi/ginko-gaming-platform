import { test, expect } from '@playwright/test'

test.describe('Game Navigation', () => {
  test('navigate to idol game page', async ({ page }) => {
    await page.goto('/games/idol')

    // Check page loads without errors
    await expect(page.locator('h1')).toContainText('偶像收藏')

    // Check game content is visible
    await expect(page.locator('text=收集你的偶像')).toBeVisible()
  })

  test('navigate to quiz game page', async ({ page }) => {
    await page.goto('/games/quiz')

    // Check page loads without errors
    await expect(page.locator('h1')).toContainText('知识竞技')

    // Check game content is visible
    await expect(page.locator('text=知识对战')).toBeVisible()
  })

  test('navigate to fate game page', async ({ page }) => {
    await page.goto('/games/fate')

    // Check page loads without errors
    await expect(page.locator('h1')).toContainText('命运占卜')

    // Check game content is visible
    await expect(page.locator('text=探索你的命运轨迹')).toBeVisible()
  })

  test('back to homepage works from game page', async ({ page }) => {
    // Start on homepage
    await page.goto('/')

    // Navigate to idol game
    await page.click('[href="/games/idol"]')

    // Wait for game page to load
    await expect(page.locator('h1')).toContainText('偶像收藏')

    // Click logo to go back to homepage
    await page.click('a:has-text("银古客栈")')

    // Check we're back on homepage
    await expect(page.locator('h1')).toContainText('银古客栈')
    await expect(page.locator('text=旅人的游戏驿站')).toBeVisible()
  })

  test('game page loads without console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/games/idol')
    await page.waitForLoadState('networkidle')

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('404')
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('game navigation via navbar links', async ({ page }) => {
    await page.goto('/')

    // Click on quiz in navbar
    await page.click('nav a[href="/games/quiz"]')

    // Check we're on quiz page
    await expect(page.locator('h1')).toContainText('知识竞技')

    // Click on fate in navbar
    await page.click('nav a[href="/games/fate"]')

    // Check we're on fate page
    await expect(page.locator('h1')).toContainText('命运占卜')
  })
})
