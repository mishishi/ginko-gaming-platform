# UX Enhancement C+A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement status awareness improvements (latency pill, status change notification) and card interaction enhancements (hover glow, press scale, favorite animation, filter transition).

**Architecture:** Modify existing GameCard and GameGrid components. Add CSS custom properties for latency colors. Add new keyframe animation for status pulse. No new components required.

**Tech Stack:** Next.js, Tailwind CSS, React hooks

---

## File Change Map

| File | Changes |
|------|---------|
| `tailwind.config.ts` | Add latency color tokens (green/yellow/red/gray) |
| `app/globals.css` | Add `--late-*` CSS vars + `card-status-pulse` keyframe |
| `components/GameCard.tsx` | Latency pill, hover glow, press 0.95, favorite bounce+glow, status change pulse |
| `components/GameGrid.tsx` | "只看可玩" chip, filter fade transition |

---

## Task 1: Add Latency Colors to tailwind.config.ts

**Files:**
- Modify: `tailwind.config.ts`

Add latency color tokens to the theme. These will be used for the pill badges.

```typescript
colors: {
  // ... existing colors ...
  'late-green': '#22c55e',
  'late-yellow': '#eab308',
  'late-red': '#ef4444',
  'late-gray': '#6b7280',
},
```

---

## Task 2: Add Latency CSS Variables and Status Pulse Animation

**Files:**
- Modify: `app/globals.css`

Add to `:root {}` section after existing `--accent-*` vars:

```css
/* Latency indicator colors */
--late-green: #22c55e;
--late-yellow: #eab308;
--late-red: #ef4444;
--late-gray: #6b7280;
```

Add new keyframe before `/* ============================================ ANIMATIONS */` section:

```css
/* Status change pulse - card glow effect */
@keyframes card-status-pulse {
  0%, 100% {
    box-shadow: 0 0 0 rgba(251, 191, 36, 0);
  }
  50% {
    box-shadow: 0 0 16px rgba(251, 191, 36, 0.4);
  }
}

.card-status-pulse {
  animation: card-status-pulse 0.6s ease-out;
}
```

---

## Task 3: Replace Status Badge with Latency Pill

**Files:**
- Modify: `components/GameCard.tsx`

Replace the existing status badge section (lines 224-258) with a new latency pill component.

Old code (lines 224-258):
```tsx
) : isLoading ? (
  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
    检测中
  </span>
) : game.playable && isReachable ? (
  <span
    className="text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 group/-status relative"
    style={{ backgroundColor: 'rgba(107, 155, 122, 0.2)', color: 'var(--accent-green)' }}
  >
    <span className="w-1 h-1 rounded-full bg-current opacity-60" />
    可玩{gameStatus?.latency != null && <span className="opacity-50">{gameStatus.latency}ms</span>}
    {/* Latency quality tooltip on hover */}
    ...
  </span>
) : ...
```

New code - replace the entire status badge section with:

```tsx
{isLoading ? (
  <span 
    className="text-[9px] px-2 py-0.5 rounded-full" 
    style={{ backgroundColor: 'rgba(107, 155, 122, 0.2)', color: 'var(--late-gray)' }}
  >
    检测中
  </span>
) : game.playable && isReachable ? (
  <span
    className="text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 group/-status relative"
    style={{ 
      backgroundColor: gameStatus?.latency != null 
        ? (gameStatus.latency < 50 
            ? 'rgba(34, 197, 94, 0.2)' 
            : gameStatus.latency < 200 
            ? 'rgba(234, 179, 8, 0.2)' 
            : 'rgba(239, 68, 68, 0.2)')
        : 'rgba(34, 197, 94, 0.2)',
      color: gameStatus?.latency != null 
        ? (gameStatus.latency < 50 
            ? 'var(--late-green)' 
            : gameStatus.latency < 200 
            ? 'var(--late-yellow)' 
            : 'var(--late-red)')
        : 'var(--late-green)'
    }}
  >
    <span className="w-1 h-1 rounded-full bg-current opacity-60" />
    可玩{gameStatus?.latency != null && ` · ${gameStatus.latency}ms`}
    {/* Hover tooltip with precise latency */}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[10px] whitespace-nowrap opacity-0 group-hover/-status:opacity-100 transition-opacity delay-150 duration-200 pointer-events-none z-10">
      延迟 {gameStatus?.latency ?? '--'}ms | 更新于 刚刚
    </span>
  </span>
) : !isOnline && game.playable ? (
  <span 
    className="text-[9px] px-2 py-0.5 rounded-full" 
    style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', color: 'var(--late-gray)' }}
  >
    离线
  </span>
) : game.playable ? (
  <span 
    className="text-[9px] px-2 py-0.5 rounded-full" 
    style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--late-red)' }}
  >
    不可用
  </span>
) : (
  <span 
    className="text-[9px] px-2 py-0.5 rounded-full" 
    style={{ backgroundColor: 'rgba(139, 122, 155, 0.2)', color: 'var(--accent-purple)' }}
  >
    维护中
  </span>
)}
```

---

## Task 4: Add Hover Glow Effect to Card

**Files:**
- Modify: `components/GameCard.tsx`

Update the card's outer `div` class (line 153) to add warm glow on hover.

Old line 153:
```tsx
<div className="group relative bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-0.5 hover:shadow-lg">
```

New line 153:
```tsx
<div className="group relative bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-1 hover:shadow-[0_0_12px_rgba(251,191,36,0.25)]">
```

---

## Task 5: Change Press Scale from 0.97 to 0.95

**Files:**
- Modify: `components/GameCard.tsx`

In the `TiltCard` component (line 89), change the press scale.

Old line 89:
```tsx
transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isPressed ? 0.97 : 1})`,
```

New line 89:
```tsx
transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isPressed ? 0.95 : 1})`,
```

---

## Task 6: Add Favorite Heart Bounce + Glow Animation

**Files:**
- Modify: `components/GameCard.tsx`

Add state for favorite animation and update the heart button.

Add new state after line 125 (`const [isOnline, setIsOnline] = useState(true)`):

```tsx
const [favoriteAnimating, setFavoriteAnimating] = useState(false)
```

Update `handleFavoriteClick` (lines 139-143):

```tsx
const handleFavoriteClick = (e: React.MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  if (!isFavorited) {
    setFavoriteAnimating(true)
    setTimeout(() => setFavoriteAnimating(false), 300)
  }
  toggleFavorite(game.slug)
}
```

Update the heart button (lines 176-186) to add the bounce+glow animation:

```tsx
<button
  onClick={handleFavoriteClick}
  className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
    isFavorited ? (favoriteAnimating ? 'animate-favorite-burst' : 'animate-pulse-once') : ''
  }`}
  style={{
    backgroundColor: isFavorited ? 'rgba(184, 149, 110, 0.3)' : 'rgba(0, 0, 0, 0.4)',
    color: isFavorited ? 'var(--accent-copper)' : 'rgba(255, 255, 255, 0.6)',
  }}
  aria-label={isFavorited ? '取消收藏' : '添加收藏'}
>
  <HeartIcon filled={isFavorited} />
</button>
```

Add the `animate-favorite-burst` keyframes to `app/globals.css`:

```css
/* Favorite heart burst animation */
@keyframes favorite-burst {
  0% { transform: scale(1); }
  30% { transform: scale(0.8); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.animate-favorite-burst {
  animation: favorite-burst 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
}
```

---

## Task 7: Add Status Change Pulse (Card Glow on Status Change)

**Files:**
- Modify: `components/GameCard.tsx`

This requires tracking previous status and triggering a pulse when it changes.

Add to the component (after line 125):

```tsx
const prevStatusRef = useRef(gameStatus)
const [statusPulse, setStatusPulse] = useState(false)

useEffect(() => {
  if (prevStatusRef.current?.reachable !== gameStatus?.reachable) {
    if (gameStatus?.reachable === true) {
      setStatusPulse(true)
      setTimeout(() => setStatusPulse(false), 600)
    }
  }
  prevStatusRef.current = gameStatus
}, [gameStatus])
```

Update the card's outer div to include the pulse class:

```tsx
<div className={`group relative bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-1 hover:shadow-[0_0_12px_rgba(251,191,36,0.25)] ${statusPulse ? 'card-status-pulse' : ''}`}>
```

---

## Task 8: Add "只看可玩" Filter Chip to GameGrid

**Files:**
- Modify: `components/GameGrid.tsx`

Add new filter type after line 19:

```tsx
type FilterOption = 'all' | 'playable' | 'coming-soon' | 'online-only'
```

Add the new filter button after the existing filter buttons (after line 147):

```tsx
<button
  key="online-only"
  onClick={() => setFilter(filter === 'online-only' ? 'all' : 'online-only')}
  className={`px-4 py-3 text-xs rounded transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[var(--accent-copper)] focus:ring-offset-1 ${
    filter === 'online-only'
      ? 'bg-[var(--late-green)] text-[var(--bg-primary)]'
      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
  }`}
  aria-pressed={filter === 'online-only'}
>
  可玩
</button>
```

Update the `matchesFilter` logic in `filteredGames` (lines 44-46):

```tsx
const matchesFilter = filter === 'all' ||
  (filter === 'playable' && game.playable) ||
  (filter === 'coming-soon' && !game.playable) ||
  (filter === 'online-only' && game.playable && status[game.slug]?.reachable)
```

You need to import `useGameStatus` to access the status map. Add to imports at top if not present.

---

## Task 9: Add Filter Transition Animation to GameGrid

**Files:**
- Modify: `components/GameGrid.tsx`

Wrap each GameCard in a transition div with staggered animation.

Replace the GameCard rendering in the grid (lines 201-213):

Old:
```tsx
filteredGames.map((game, index) => (
  <div
    key={game.slug}
    role="gridcell"
    ref={(el) => { cardRefs.current[index] = el }}
  >
    <GameCard
      game={game}
      index={index}
      onKeyDown={(e) => handleKeyDown(e, index)}
      tabIndex={focusedIndex === index || (focusedIndex === -1 && index === 0) ? 0 : -1}
    />
  </div>
))
```

New:
```tsx
filteredGames.map((game, index) => (
  <div
    key={game.slug}
    role="gridcell"
    ref={(el) => { cardRefs.current[index] = el }}
    className="transition-all duration-300 ease-out"
    style={{
      opacity: 1,
      transform: 'scale(1)',
      animation: `fade-scale-in 0.3s ease-out ${index * 30}ms both`,
    }}
  >
    <GameCard
      game={game}
      index={index}
      onKeyDown={(e) => handleKeyDown(e, index)}
      tabIndex={focusedIndex === index || (focusedIndex === -1 && index === 0) ? 0 : -1}
    />
  </div>
))
```

Add the keyframes to `app/globals.css`:

```css
/* Filter transition - fade + scale */
@keyframes fade-scale-in {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## Task 10: Verify and Commit

**Files:**
- All modified files above

Run the app and verify:
1. Latency pill shows with correct color coding (green/yellow/red)
2. Hover on card shows warm glow
3. Click/tap on card scales to 0.95
4. Heart button bounces + glows when favoriting
5. Status change triggers card border pulse
6. "只看可玩" chip filters to only online games
7. Filtering cards animate with fade+scale

Commit each logical group:
```bash
git add components/GameCard.tsx components/GameGrid.tsx tailwind.config.ts app/globals.css
git commit -m "feat(ui): implement UX enhancement C+A

- Add latency color-coded pill badges
- Add warm glow hover effect on cards
- Change press scale to 0.95 for stronger feedback
- Add heart bounce+glow animation on favorite
- Add card pulse animation on status change
- Add '只看可玩' filter chip
- Add filter fade+scale transition

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Self-Review Checklist

- [ ] All spec requirements have corresponding tasks
- [ ] No placeholder code (TBD, TODO, "implement later")
- [ ] Color values match spec (#22c55e, #eab308, #ef4444, #6b7280)
- [ ] Animation durations match spec (300ms for favorite, 600ms for status pulse)
- [ ] Hover translate-y changed from -0.5 to -1
- [ ] Press scale changed from 0.97 to 0.95
- [ ] Stagger delay is 30ms per card
- [ ] Filter chip uses --late-green when selected
