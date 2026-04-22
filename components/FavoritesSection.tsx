'use client'

import { useMemo } from 'react'
import { useFavorites } from '@/contexts/FavoritesContext'
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
  const { favorites, isLoaded } = useFavorites()

  const favoriteGames = useMemo(() => {
    return favorites
      .map((slug) => games.find((g: Game) => g.slug === slug))
      .filter((g): g is Game => g !== undefined)
  }, [favorites])

  // Don't render until favorites are loaded from localStorage
  if (!isLoaded) {
    return null
  }

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
