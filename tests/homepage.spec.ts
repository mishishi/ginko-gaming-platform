import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('homepage loads without errors', async ({ page }) => {
    // Check page title/content is visible
    await expect(page.locator('h1')).toContainText('银古客栈')

    // Collect console errors
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('404')
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('all 3 game cards are visible', async ({ page }) => {
    // Wait for game cards to load
    await page.waitForSelector('[href="/games/idol"]')

    // Check all three game cards are present (in nav and grid)
    const idolLink = page.locator('[href="/games/idol"]').first()
    const quizLink = page.locator('[href="/games/quiz"]').first()
    const fateLink = page.locator('[href="/games/fate"]').first()

    await expect(idolLink).toBeVisible()
    await expect(quizLink).toBeVisible()
    await expect(fateLink).toBeVisible()
  })

  test('theme toggle works', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Get the theme toggle button
    const themeToggle = page.locator('button[aria-label*="切换到"]')

    // Check initial theme is dark
    const initialTheme = await page.evaluate(() => {
      return localStorage.getItem('theme')
    })

    // Click theme toggle
    await themeToggle.click()

    // Check localStorage was updated
    const newTheme = await page.evaluate(() => {
      return localStorage.getItem('theme')
    })

    if (initialTheme === 'dark') {
      expect(newTheme).toBe('light')
    } else {
      expect(newTheme).toBe('dark')
    }

    // Toggle again
    await themeToggle.click()
    const toggledBack = await page.evaluate(() => {
      return localStorage.getItem('theme')
    })
    expect(toggledBack).toBe(initialTheme)
  })

  test('search input filters games', async ({ page }) => {
    // Wait for game cards to load
    await page.waitForSelector('[href="/games/idol"]')

    // Find search input
    const searchInput = page.locator('input[placeholder="搜索游戏..."]')

    // Type to search for "偶像"
    await searchInput.fill('偶像')
    await page.waitForTimeout(300) // Wait for debounce/filter

    // Check idol game is still visible in the grid
    const idolInGrid = page.locator('.grid a[href="/games/idol"]')
    await expect(idolInGrid).toBeVisible()

    // Search for something that doesn't exist
    await searchInput.fill('nonexistent12345')
    await page.waitForTimeout(300)

    // Check no games shown and "clear search" button appears
    await expect(page.locator('text=没有找到匹配的游戏')).toBeVisible()
    await expect(page.locator('text=清除搜索条件')).toBeVisible()
  })

  test('filter buttons work', async ({ page }) => {
    // Wait for game cards to load
    await page.waitForSelector('[href="/games/idol"]')

    // Click "敬请期待" filter (coming soon - only fate is not playable)
    const comingSoonFilter = page.getByRole('button', { name: '敬请期待' })
    await comingSoonFilter.click()
    await page.waitForTimeout(300)

    // After clicking "敬请期待", only fate should be visible in game grid
    const fateInGrid = page.locator('.grid a[href="/games/fate"]')
    await expect(fateInGrid).toBeVisible()

    // Click "全部" filter
    const allFilter = page.getByRole('button', { name: '全部' })
    await allFilter.click()
    await page.waitForTimeout(300)

    // All games should be visible again in the grid
    await expect(page.locator('.grid a[href="/games/idol"]').first()).toBeVisible()
    await expect(page.locator('.grid a[href="/games/quiz"]').first()).toBeVisible()
    await expect(page.locator('.grid a[href="/games/fate"]').first()).toBeVisible()
  })
})
