'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useGameStatus } from '@/components/GameStatusProvider'
import { useRecentlyPlayed } from '@/hooks/useRecentlyPlayed'
import GameCard from '@/components/GameCard'
import HomepageSkeleton from '@/components/HomepageSkeleton'
import { games, Game } from '@/lib/games'

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

type FilterOption = 'all' | 'playable' | 'coming-soon'

export default function GameGrid() {
  const { isLoading } = useGameStatus()
  const { recentlyPlayed, clearRecentlyPlayed } = useRecentlyPlayed()
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterOption>('all')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const recentGames = useMemo(() => {
    return recentlyPlayed
      .map((entry) => games.find((g) => g.slug === entry.slug))
      .filter((g): g is Game => g !== undefined)
  }, [recentlyPlayed])

  const columnsCount = 3

  const filteredGames = useMemo(() => {
    return games.filter((game: Game) => {
      const matchesSearch = searchQuery === '' ||
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())

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
        newIndex = index > 0 ? index - 1 : totalCards - 1
        break
      case 'ArrowRight':
        e.preventDefault()
        newIndex = index < totalCards - 1 ? index + 1 : 0
        break
      case 'ArrowUp':
        e.preventDefault()
        newIndex = index >= columnsCount ? index - columnsCount : index + (Math.ceil(totalCards / columnsCount) - 1) * columnsCount
        if (newIndex >= totalCards) {
          newIndex = totalCards - 1
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        newIndex = index + columnsCount
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
  }, [filteredGames.length, columnsCount])

  useEffect(() => {
    if (focusedIndex >= 0 && cardRefs.current[focusedIndex]) {
      const link = cardRefs.current[focusedIndex]?.querySelector('a')
      link?.focus()
    }
  }, [focusedIndex])

  useEffect(() => {
    setFocusedIndex(-1)
  }, [searchQuery, filter])

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-md">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="搜索游戏..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded border bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-copper)] transition-colors duration-200"
            aria-label="搜索游戏"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-1">
          {([
            { value: 'all', label: '全部' },
            { value: 'playable', label: '可玩' },
            { value: 'coming-soon', label: '待发' },
          ] as { value: FilterOption; label: string }[]).map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-3 text-xs rounded transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[var(--accent-copper)] focus:ring-offset-1 ${
                filter === option.value
                  ? 'bg-[var(--accent-copper)] text-[var(--bg-primary)]'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
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
        <p className="text-xs text-[var(--text-muted)]">
          找到 {filteredGames.length} 个游戏
        </p>
      )}

      {/* Recently Played */}
      {!searchQuery && recentGames.length > 0 && (
        <section aria-labelledby="recently-played-heading">
          <div className="flex items-center gap-3 mb-6">
            <div className="ink-dot" />
            <h2 id="recently-played-heading" className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.15em]">
              最近游玩
            </h2>
            {recentGames.length > 0 && (
              <button
                onClick={clearRecentlyPlayed}
                className="text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-copper)] transition-colors"
                aria-label="清除最近游玩记录"
              >
                清除
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentGames.slice(0, 3).map((game, index) => {
              const entry = recentlyPlayed.find((r) => r.slug === game.slug)
              return (
                <GameCard
                  key={game.slug}
                  game={game}
                  index={index}
                  lastPlayedAt={entry?.timestamp}
                />
              )
            })}
          </div>
        </section>
      )}

      {/* Game Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
        )}
      </div>
    </div>
  )
}
