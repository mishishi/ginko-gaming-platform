# UX Enhancement 2 Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve UX score from ~7 to 8+ with 8 targeted enhancements

**Architecture:** Each issue is addressed with minimal, focused changes using existing patterns in the codebase.

**Tech Stack:** Next.js App Router, React hooks, localStorage, CSS animations

---

## Task 1: TourGuide Auto-Trigger on First Visit

**Files:**
- Modify: `components/TourGuide.tsx`

- [ ] **Step 1: Read TourGuide.tsx**

```bash
cat components/TourGuide.tsx
```

- [ ] **Step 2: Add auto-trigger logic using useEffect**

In TourGuide, add a useEffect that calls `open()` when `hasSeenTour` is false after mount:

```typescript
useEffect(() => {
  if (!hasSeenTour && isLoading === false) {
    // Small delay for page to settle
    const timer = setTimeout(() => {
      open()
    }, 500)
    return () => clearTimeout(timer)
  }
}, [hasSeenTour, isLoading])
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/TourGuide.tsx
git commit -m "feat(tour): auto-trigger guide for first-time visitors"
```

---

## Task 2: Scroll-to-Top Button

**Files:**
- Create: `components/ScrollToTop.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create ScrollToTop component**

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-copper)] hover:border-[var(--accent-copper)] transition-all duration-200 z-40"
      aria-label="回到顶部"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}
```

- [ ] **Step 2: Add ScrollToTop to homepage**

In `app/page.tsx`, import and add `<ScrollToTop />` before the closing `</div>`.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/ScrollToTop.tsx app/page.tsx
git commit -m "feat(ui): add scroll-to-top button"
```

---

## Task 3: Offline Indicator

**Files:**
- Create: `components/OfflineIndicator.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create OfflineIndicator component**

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function OfflineIndicator() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    setOffline(!navigator.onLine)
    
    const handleOnline = () => setOffline(false)
    const handleOffline = () => setOffline(true)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!offline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-black text-xs py-1.5 text-center z-50 font-medium">
      网络连接已断开，部分功能可能不可用
    </div>
  )
}
```

- [ ] **Step 2: Add OfflineIndicator to layout**

In `app/layout.tsx`, import and add `<OfflineIndicator />` as the first child inside `<body>`.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/OfflineIndicator.tsx app/layout.tsx
git commit -m "feat(a11y): add offline network indicator"
```

---

## Task 4: Favorites Optimistic UI Refinement

**Files:**
- Modify: `hooks/useFavorites.ts`

The current implementation already uses optimistic updates. Review and confirm the pattern is correct.

- [ ] **Step 1: Read useFavorites.ts**

```bash
cat hooks/useFavorites.ts
```

- [ ] **Step 2: Verify optimistic pattern is correct**

Current code should:
1. Update state immediately (`setFavorites`)
2. Persist to localStorage in try/catch
3. Rollback on error (already handled by React)

If it looks correct, no changes needed. If not, fix the pattern.

- [ ] **Step 3: Commit (if changed)**

```bash
git add hooks/useFavorites.ts
git commit -m "fix(favorites): ensure optimistic update pattern"
```

---

## Task 5: Clear Recently Played

**Files:**
- Modify: `hooks/useRecentlyPlayed.ts`

- [ ] **Step 1: Read useRecentlyPlayed.ts**

```bash
cat hooks/useRecentlyPlayed.ts
```

- [ ] **Step 2: Add clearRecentlyPlayed function**

Add `clearRecentlyPlayed` function that resets to empty array:

```typescript
const clearRecentlyPlayed = useCallback(() => {
  setRecentlyPlayed([])
  try {
    localStorage.removeItem(RECENTLY_PLAYED_KEY)
  } catch {}
}, [])
```

Add to the return object alongside `addToRecentlyPlayed`.

- [ ] **Step 3: Add clear button to GameGrid**

In `components/GameGrid.tsx`, add a clear button next to "最近游玩" heading:

```typescript
{recentGames.length > 0 && (
  <button
    onClick={clearRecentlyPlayed}
    className="text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-copper)] transition-colors"
    aria-label="清除最近游玩记录"
  >
    清除
  </button>
)}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add hooks/useRecentlyPlayed.ts components/GameGrid.tsx
git commit -m "feat(ui): add clear recently played functionality"
```

---

## Task 6: Search Suggestions in Empty State

**Files:**
- Modify: `components/GameGrid.tsx`

- [ ] **Step 1: Add suggestions to empty state**

In the empty state div, add suggested search terms:

```typescript
<div className="col-span-full py-20 text-center">
  {/* Empty state lantern */}
  <div className="flex justify-center mb-6">
    <svg className="w-12 h-16 text-[var(--accent-copper)] opacity-30" viewBox="0 0 40 60" fill="none" aria-hidden="true">
      <rect x="15" y="2" width="10" height="3" rx="1" fill="currentColor" opacity="0.5" />
      <path d="M12 8 C8 8 6 14 6 20 L6 40 C6 46 10 50 14 50 L26 50 C30 50 34 46 34 40 L34 20 C34 14 32 8 28 8 L12 8Z" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  </div>
  <p className="text-[var(--text-secondary)] text-sm mb-4">没有找到匹配的游戏</p>
  <div className="flex flex-wrap justify-center gap-2 mb-6">
    <span className="text-xs text-[var(--text-muted)]">试试:</span>
    {['偶像', '竞技', '命运', '推理'].map((term) => (
      <button
        key={term}
        onClick={() => setSearchQuery(term)}
        className="px-2 py-1 text-xs rounded border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--accent-copper)] hover:border-[var(--accent-copper)] transition-all duration-200"
      >
        {term}
      </button>
    ))}
  </div>
  <button
    onClick={() => { setSearchQuery(''); setFilter('all') }}
    className="px-4 py-2 text-xs rounded border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--accent-copper)] hover:border-[var(--accent-copper)] transition-all duration-200"
  >
    清除搜索条件
  </button>
</div>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/GameGrid.tsx
git commit -m "feat(ui): add search suggestions in empty state"
```

---

## Task 7: NavBar Help Button

**Files:**
- Modify: `components/NavBar.tsx`

- [ ] **Step 1: Read NavBar.tsx**

```bash
cat components/NavBar.tsx
```

- [ ] **Step 2: Add help button**

Find where theme toggle or other buttons are rendered and add a help button:

```typescript
<button
  onClick={toggleKeyboardHelp}
  className="p-2 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--accent-copper)] transition-colors"
  aria-label="键盘快捷键"
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
</button>
```

You'll need to import `useKeyboardShortcutsHelp` or however the keyboard help modal is triggered. Check `components/KeyboardShortcutsHelp.tsx` for the hook.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/NavBar.tsx
git commit -m "feat(a11y): add keyboard help button to navbar"
```

---

## Task 8: OG Image Sharing Endpoint

**Files:**
- Create: `app/api/og/route.tsx`

- [ ] **Step 1: Create OG image route**

```typescript
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
 
export const runtime = 'edge'
 
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || '银古客栈'
  const color = searchParams.get('color') || '#b8956e'
 
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1512',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            width: 200,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            marginBottom: 40,
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontStyle: 'bold',
            color: color,
            textAlign: 'center',
            padding: '0 60px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: 200,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            marginTop: 40,
          }}
        />
        <div
          style={{
            marginTop: 60,
            fontSize: 24,
            color: '#8a7a6a',
          }}
        >
          银古客栈
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/api/og/route.tsx
git commit -m "feat(seo): add OG image sharing endpoint"
```

---

## Verification

After all tasks complete, run final build verification:

```bash
npm run build
```

Visit `/games/idol` and check:
1. TourGuide auto-shows on first visit
2. Scroll-to-top button appears after scrolling down
3. Turn off network, verify offline banner appears
4. Add/remove favorites, verify instant update
5. Recently played shows, verify clear button works
6. Search for nothing, verify suggestion chips appear
7. Click help button in NavBar, verify modal opens
8. Test OG image at `/api/og?title=test&color=%23b8956e`
