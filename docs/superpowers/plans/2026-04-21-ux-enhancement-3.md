# UX Enhancement 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add favorites section to homepage, enhance micro-interactions (button feedback, card states), and optimize mobile responsive layout

**Architecture:** Create FavoritesSection component reusing GameCard, enhance existing button/card styles with Tailwind micro-interactions, ensure responsive grid adapts properly across breakpoints

**Tech Stack:** React, Tailwind CSS, localStorage, Next.js App Router

---

## Task 1: Create FavoritesSection Component

**Files:**
- Create: `components/FavoritesSection.tsx`

- [ ] **Step 1: Create FavoritesSection component**

```tsx
'use client'

import { useMemo } from 'react'
import { useFavorites } from '@/hooks/useFavorites'
import { games, Game } from '@/lib/games'
import GameCard from '@/components/GameCard'

function EmptyState() {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-4">
        <svg className="w-10 h-14 text-[var(--accent-copper)] opacity-25" viewBox="0 0 40 60" fill="none" aria-hidden="true">
          <rect x="15" y="2" width="10" height="3" rx="1" fill="currentColor" opacity="0.5" />
          <path d="M12 8 C8 8 6 14 6 20 L6 40 C6 46 10 50 14 50 L26 50 C30 50 34 46 34 40 L34 20 C34 14 32 8 28 8 L12 8Z" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      <p className="text-[var(--text-muted)] text-sm">暂无收藏</p>
      <p className="text-[var(--text-muted)] text-xs mt-1">点击游戏卡片上的心形图标添加收藏</p>
    </div>
  )
}

export default function FavoritesSection() {
  const { favorites } = useFavorites()

  const favoriteGames = useMemo(() => {
    return favorites
      .map((slug) => games.find((g: Game) => g.slug === slug))
      .filter((g): g is Game => g !== undefined)
  }, [favorites])

  if (favoriteGames.length === 0) {
    return (
      <section aria-labelledby="favorites-heading">
        <div className="flex items-center gap-3 mb-6">
          <div className="ink-dot" />
          <h2 id="favorites-heading" className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.15em]">
            我的收藏
          </h2>
        </div>
        <EmptyState />
      </section>
    )
  }

  return (
    <section aria-labelledby="favorites-heading">
      <div className="flex items-center gap-3 mb-6">
        <div className="ink-dot" />
        <h2 id="favorites-heading" className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.15em]">
          我的收藏
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {favoriteGames.map((game, index) => (
          <GameCard
            key={game.slug}
            game={game}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify file compiles**

Run: `npx tsc --noEmit components/FavoritesSection.tsx`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/FavoritesSection.tsx
git commit -m "feat(favorites): add FavoritesSection component"
```

---

## Task 2: Integrate FavoritesSection into Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add FavoritesSection import**

Find line 2 in app/page.tsx:
```tsx
import GameGrid from '@/components/GameGrid'
```
Add after:
```tsx
import FavoritesSection from '@/components/FavoritesSection'
```

- [ ] **Step 2: Add FavoritesSection above GameGrid in the Games Display Section**

Find the section marked "Games Display Section" in app/page.tsx. After the closing `</div>` of the section header (around line 153), add:

```tsx
<ScrollReveal>
  <FavoritesSection />
</ScrollReveal>
```

The Games Display Section should look like:
```tsx
{/* Games Display Section */}
<section className="max-w-5xl mx-auto px-4 py-16">
  {/* 区域标题 */}
  <div className="flex items-center gap-4 mb-12">
    <div className="ink-dot" />
    <h2 className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.25em]">
      珍藏展品
    </h2>
    <div className="flex-1 ink-divider ml-2" />
  </div>

  <ScrollReveal>
    <FavoritesSection />
  </ScrollReveal>

  <ScrollReveal>
    <GameGrid />
  </ScrollReveal>
</section>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Successful build

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(homepage): integrate FavoritesSection above game grid"
```

---

## Task 3: Add Button Micro-interactions (active:scale-95)

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Verify tailwind config supports active:scale utilities**

Read `tailwind.config.ts` to check if `active` variant is configured.

- [ ] **Step 2: If not configured, add to config**

Find the `theme.extend` section and add:

```ts
theme: {
  extend: {
    // ... existing
  },
},
```

Then check if `active` variant is already in `plugins` array.

- [ ] **Step 3: Commit button state changes are handled in next task**

Note: Button micro-interactions will be applied in Task 4 when we modify GameCard.tsx

---

## Task 4: Enhance GameCard Micro-interactions

**Files:**
- Modify: `components/GameCard.tsx`
- Modify: `components/GameGrid.tsx`

- [ ] **Step 1: Add pulse animation to favorite button**

In GameCard.tsx, find the favorite button (around line 176-186):

```tsx
<button
  onClick={handleFavoriteClick}
  className="absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
```

Change to:
```tsx
<button
  onClick={handleFavoriteClick}
  className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${isFavorited ? 'animate-pulse-once' : ''}`}
```

- [ ] **Step 2: Add active:scale-95 to all buttons in GameCard**

Search for all `className` containing `transition` in GameCard.tsx and ensure `active:scale-95` is included where buttons are defined.

- [ ] **Step 3: Add pulse-once animation to tailwind**

Read `tailwind.config.ts` and add to `theme.extend.animation`:

```ts
pulseOnce: {
  '0%, 100%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.15)' },
},
```

And add to `theme.extend.animationDuration` if needed:
```ts
pulseOnce: '0.3s',
```

- [ ] **Step 4: Enhance TiltCard press effect**

In GameCard.tsx, find the TiltCard component's style around line 86-91:

```tsx
style={{
  transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isPressed ? 0.98 : 1})`,
  transformStyle: 'preserve-3d',
}}
```

Change `0.98` to `0.97` for stronger press feedback:
```tsx
style={{
  transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isPressed ? 0.97 : 1})`,
  transformStyle: 'preserve-3d',
}}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Successful build

- [ ] **Step 6: Commit**

```bash
git add components/GameCard.tsx tailwind.config.ts
git commit -m "feat(ui): enhance GameCard micro-interactions"
```

---

## Task 5: Mobile Layout Optimization

**Files:**
- Modify: `components/GameGrid.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Review and fix GameGrid responsive columns**

In GameGrid.tsx, the recent games grid uses `grid-cols-1 md:grid-cols-3` (line 176) and main grid uses `grid-cols-1 md:grid-cols-3` (line 194). These are correct for mobile-first approach.

- [ ] **Step 2: Review mobile nav in NavBar**

Read `components/NavBar.tsx` to check hamburger menu implementation for mobile.

- [ ] **Step 3: Add touch-friendly sizing to filter buttons**

In GameGrid.tsx, find filter buttons (around line 135-147). Increase touch target:

```tsx
className={`px-4 py-3 text-sm rounded-lg transition-all duration-200 ...`}
```

Change minimum touch target from `px-3 py-2` to `px-4 py-3`.

- [ ] **Step 4: Verify mobile breakpoints**

Check that GameGrid uses proper mobile-first approach with `grid-cols-1` for base, `md:grid-cols-2` or `md:grid-cols-3` for tablet/desktop.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Successful build

- [ ] **Step 6: Commit**

```bash
git add components/GameGrid.tsx
git commit -m "feat(mobile): optimize touch targets and responsive grid"
```

---

## Task 6: Verify All Changes

- [ ] **Step 1: Run build**

```bash
npm run build
```
Expected: Successful build

- [ ] **Step 2: Test locally**

Run: `npm run dev`
Visit http://localhost:3000 and verify:
1. "我的收藏" section appears above game grid
2. Empty state shows when no favorites
3. Cards respond to hover/press with visual feedback
4. Favorite button pulses on click
5. Mobile view shows single column

- [ ] **Step 3: Commit all remaining changes**

```bash
git add -A
git commit -m "feat(ux): complete ux enhancement 3 - favorites, micro-interactions, mobile optimization"
```

---

## File Summary

| File | Change |
|------|--------|
| `components/FavoritesSection.tsx` | Create - new component |
| `app/page.tsx` | Modify - add FavoritesSection import and render |
| `components/GameCard.tsx` | Modify - enhance micro-interactions |
| `components/GameGrid.tsx` | Modify - improve touch targets |
| `tailwind.config.ts` | Modify - add pulse-once animation |

## Verification Checklist

- [ ] Homepage displays "我的收藏" section
- [ ] Empty state shows when no favorites
- [ ] Favorited games appear in section
- [ ] Clicking game card navigates to game
- [ ] Removing favorite immediately updates UI
- [ ] Cards have hover lift effect
- [ ] Cards have press (scale down) effect
- [ ] Favorite button has pulse animation on click
- [ ] Buttons have active:scale-95 feedback
- [ ] Mobile shows single column layout
- [ ] Filter buttons have adequate touch targets
- [ ] Build succeeds without errors
