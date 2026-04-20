'use client'

import { useState, useMemo } from 'react'
import { useGameStatus } from '@/components/GameStatusProvider'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterOption>('all')

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

      {/* Game Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {isLoading ? (
          <HomepageSkeleton />
        ) : filteredGames.length > 0 ? (
          filteredGames.map((game, index) => (
            <GameCard key={game.slug} game={game} index={index} />
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
