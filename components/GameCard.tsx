'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Game } from '@/lib/games'
import { useGameStatus } from './GameStatusProvider'
import { useFavorites } from '@/hooks/useFavorites'
import GameScreenshot from './GameScreenshots'

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

interface GameCardProps {
  game: Game
  index: number
  onKeyDown?: (e: React.KeyboardEvent<HTMLAnchorElement>) => void
  tabIndex?: number
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -4
    const rotateY = ((x - centerX) / centerX) * 4
    setTilt({ rotateX, rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '800px' }}
    >
      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="text-[10px] tracking-wider" style={{ color: 'var(--text-muted)' }}>
      {'★'.repeat(level)}{'☆'.repeat(5 - level)}
    </span>
  )
}

export default function GameCard({ game, index, onKeyDown, tabIndex = 0 }: GameCardProps) {
  const { status, isLoading } = useGameStatus()
  const { favorites, toggleFavorite } = useFavorites()
  const gameStatus = status[game.slug]
  const isReachable = gameStatus?.reachable ?? false
  const isFavorited = favorites.includes(game.slug)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(game.slug)
  }

  return (
    <Link
      href={`/games/${game.slug}`}
      className="block animate-fade-in-up"
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
    >
      <TiltCard>
        <div className="group relative bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-0.5">
          {/* Top accent line */}
          <div
            className="h-px w-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${game.color}60 50%, transparent 100%)`,
            }}
          />

          {/* Screenshot area */}
          <div className="relative h-32 overflow-hidden">
            <GameScreenshot game={game} />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />

            {/* Favorite button */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: isFavorited ? 'rgba(184, 149, 110, 0.3)' : 'rgba(0, 0, 0, 0.4)',
                color: isFavorited ? 'var(--accent-copper)' : 'rgba(255, 255, 255, 0.6)',
              }}
              aria-label={isFavorited ? '取消收藏' : '添加收藏'}
            >
              <HeartIcon filled={isFavorited} />
            </button>

            {/* Collection number */}
            <div
              className="absolute bottom-2 right-3 text-xs font-mono tabular-nums opacity-20"
              style={{ color: game.color }}
            >
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Metadata row */}
            <div className="flex items-center gap-2 mb-2">
              <DifficultyStars level={game.difficulty} />
              <span className="text-[10px] text-[var(--text-muted)] opacity-40">|</span>
              <span className="text-[10px] text-[var(--text-muted)]">{game.playerCount}</span>
              {isLoading ? (
                <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                  检测中
                </span>
              ) : (
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: game.playable && isReachable ? 'rgba(74, 92, 79, 0.3)' : 'rgba(184, 149, 110, 0.2)',
                    color: game.playable && isReachable ? 'var(--accent-green)' : 'var(--accent-copper)',
                  }}
                >
                  {game.playable && isReachable ? '可玩' : game.playable ? '离线' : '维护中'}
                </span>
              )}
            </div>

            {/* Game title */}
            <h3
              className="text-xl mb-1 transition-colors duration-300"
              style={{
                color: game.color,
                fontFamily: 'var(--font-serif), Noto Serif SC, serif',
              }}
            >
              {game.title}
            </h3>

            {/* Subtitle */}
            <p className="text-[var(--text-secondary)] text-xs mb-2">
              {game.subtitle}
            </p>

            {/* Description */}
            <p className="text-[var(--text-muted)] text-xs line-clamp-2 leading-relaxed">
              {game.description}
            </p>

            {/* Enter link */}
            <div className="mt-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <span
                className="text-xs"
                style={{ color: game.color }}
              >
                进入游戏 →
              </span>
            </div>
          </div>
        </div>
      </TiltCard>
    </Link>
  )
}
