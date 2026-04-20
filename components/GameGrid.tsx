'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useGameStatus } from '@/components/GameStatusProvider'
import { useRecentlyPlayed } from '@/hooks/useRecentlyPlayed'
import GameCard from '@/components/GameCard'
import HomepageSkeleton from '@/components/HomepageSkeleton'
import { games, Game } from '@/lib/games'

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  )
}

type FilterOption = 'all' | 'playable' | 'coming-soon'

export default function GameGrid() {
  const { isLoading } = useGameStatus()
  const { recentlyPlayed } = useRecentlyPlayed()
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterOption>('all')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Get recently played games in order
  const recentGames = useMemo(() => {
    return recentlyPlayed
      .map((entry) => games.find((g) => g.slug === entry.slug))
      .filter((g): g is Game => g !== undefined)
  }, [recentlyPlayed])

  const columnsCount = 3 // md:grid-cols-3

  const filteredGames = useMemo(() => {
    return games.filter((game: Game) => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const matchesFilter = filter === 'all' ||
        (filter === 'playable' && game.playable) ||
        (filter === 'coming-soon' && !game.playable)

      return matchesSearch && matchesFilter
    })
  }, [searchQuery, filter])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    const totalCards = filteredGames.length
    if (totalCards === 0) return

    let newIndex = -1

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        newIndex = index > 0 ? index - 1 : totalCards - 1 // wrap to end
        break
      case 'ArrowRight':
        e.preventDefault()
        newIndex = index < totalCards - 1 ? index + 1 : 0 // wrap to start
        break
      case 'ArrowUp':
        e.preventDefault()
        newIndex = index >= columnsCount ? index - columnsCount : index + (Math.ceil(totalCards / columnsCount) - 1) * columnsCount
        // Adjust for wrap-around on last row
        if (newIndex >= totalCards) {
          newIndex = totalCards - 1
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        newIndex = index + columnsCount
        // Wrap to start if beyond last
        if (newIndex >= totalCards) {
          newIndex = index % columnsCount
          if (newIndex >= totalCards) newIndex = totalCards - 1
        }
        break
      case 'Home':
        e.preventDefault()
        newIndex = 0
        break
      case 'End':
        e.preventDefault()
        newIndex = totalCards - 1
        break
      default:
        return
    }

    if (newIndex >= 0 && newIndex < totalCards) {
      setFocusedIndex(newIndex)
    }
  }, [filteredGames.length])

  // Focus the card when focusedIndex changes
  useEffect(() => {
    if (focusedIndex >= 0 && cardRefs.current[focusedIndex]) {
      cardRefs.current[focusedIndex]?.focus()
    }
  }, [focusedIndex])

  // Reset focused index when filtered games change
  useEffect(() => {
    setFocusedIndex(-1)
  }, [searchQuery, filter])

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="搜索游戏..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-amber)] focus:ring-1 focus:ring-[var(--accent-amber)] transition-colors duration-200"
            aria-label="搜索游戏"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-muted)] text-sm hidden sm:block">
            <FilterIcon />
          </span>
          {([
            { value: 'all', label: '全部' },
            { value: 'playable', label: '可玩' },
            { value: 'coming-soon', label: '敬请期待' },
          ] as { value: FilterOption; label: string }[]).map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] focus:ring-offset-2 focus:ring-offset-bg-primary ${
                filter === option.value
                  ? 'bg-[var(--accent-amber)] text-[var(--bg-primary)]'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
              aria-pressed={filter === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="text-sm text-[var(--text-muted)]">
          找到 {filteredGames.length} 个游戏
        </p>
      )}

      {/* Recently Played Section */}
      {!searchQuery && recentGames.length > 0 && (
        <section aria-labelledby="recently-played-heading">
          <h2
            id="recently-played-heading"
            className="text-center text-[var(--text-secondary)] text-sm uppercase tracking-widest mb-6 animate-fade-in"
          >
            最近游玩
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {recentGames.slice(0, 5).map((game, index) => (
              <GameCard
                key={game.slug}
                game={game}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {/* Game Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        role="grid"
        aria-label="游戏列表"
      >
        {isLoading ? (
          <HomepageSkeleton />
        ) : filteredGames.length > 0 ? (
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
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-[var(--text-secondary)]">没有找到匹配的游戏</p>
            <button
              onClick={() => { setSearchQuery(''); setFilter('all'); }}
              className="mt-2 text-sm text-[var(--accent-amber)] hover:underline"
            >
              清除搜索条件
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
