'use client'

import { useState, useRef, useEffect, useCallback, memo } from 'react'
import Link from 'next/link'
import { Game, GAME_CATEGORIES } from '@/lib/games'
import { useGameStatus } from './GameStatusProvider'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useGameRatings } from '@/hooks/useGameRatings'
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
  lastPlayedAt?: number
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [isPressed, setIsPressed] = useState(false)
  const rafRef = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isPressed) return

    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -4
      const rotateY = ((x - centerX) / centerX) * 4
      setTilt({ rotateX, rotateY })
    })
  }, [isPressed])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || isPressed || e.touches.length === 0) return

    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      if (!cardRef.current) return
      const touch = e.touches[0]
      const rect = cardRef.current.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -2
      const rotateY = ((x - centerX) / centerX) * 2
      setTilt({ rotateX, rotateY })
    })
  }, [isPressed])

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 })
  }, [])

  const handleMouseDown = useCallback(() => setIsPressed(true), [])
  const handleMouseUp = useCallback(() => setIsPressed(false), [])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      style={{ perspective: '800px' }}
    >
      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isPressed ? 0.95 : 1})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  )
}

interface TouchGesturesProps {
  game: Game
  isFavorited: boolean
  onFavorite: (e?: React.MouseEvent | React.TouchEvent) => void
  children: React.ReactNode
}

function TouchGestures({ game, isFavorited, onFavorite, children }: TouchGesturesProps) {
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const swipeStartXRef = useRef<number | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 })

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    swipeStartXRef.current = touch.clientX

    // Start long press detection
    longPressTimeoutRef.current = setTimeout(() => {
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setPreviewPos({ x: rect.width / 2, y: rect.height / 2 })
      setShowPreview(true)
    }, 500)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (swipeStartXRef.current === null) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - swipeStartXRef.current

    // Cancel long press if user moves finger significantly
    if (Math.abs(deltaX) > 10 || Math.abs(touch.clientY - (longPressTimeoutRef.current ? 0 : 0)) > 10) {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current)
        longPressTimeoutRef.current = null
      }
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current)
      longPressTimeoutRef.current = null
    }

    if (swipeStartXRef.current === null) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - swipeStartXRef.current

    // Swipe right to favorite (> 50px swipe)
    if (deltaX > 50) {
      onFavorite(e)
    }

    swipeStartXRef.current = null
    setShowPreview(false)
  }, [onFavorite])

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {children}

      {/* Long press preview */}
      {showPreview && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg"
          style={{
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          <div className="text-center p-4 max-w-[200px]">
            <div
              className="text-2xl font-serif mb-2"
              style={{ color: game.color, textShadow: `0 0 12px ${game.color}` }}
            >
              {game.title}
            </div>
            <div className="text-xs text-white/70 mb-2">
              {game.subtitle}
            </div>
            <div
              className="text-[10px] px-2 py-1 rounded-full mx-auto"
              style={{
                backgroundColor: `${game.color}20`,
                border: `1px solid ${game.color}40`,
                color: game.color,
              }}
            >
              {game.playerCount}
            </div>
            {!isFavorited && (
              <div className="mt-3 text-xs text-white/50">
                右滑收藏 →
              </div>
            )}
          </div>
        </div>
      )}
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

interface RatingStarsProps {
  gameSlug: string
  stats: { average: number; count: number; userRating: number | null }
  onRate: (rating: number) => void
}

function RatingStars({ stats, onRate }: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const displayRating = hoverRating ?? stats.userRating ?? 0

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onRate(star)
            }}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
            className="text-[10px] transition-transform duration-100 active:scale-95 hover:scale-125"
            style={{
              color: star <= displayRating ? 'var(--accent-copper)' : 'var(--text-muted)',
              opacity: star <= displayRating ? 1 : 0.3,
            }}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>
      {stats.count > 0 && (
        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
          {stats.average.toFixed(1)}
        </span>
      )}
    </div>
  )
}

function formatTimeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins} 分钟前`
  if (diffHours < 24) return `${diffHours} 小时前`
  if (diffDays < 7) return `${diffDays} 天前`
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

interface StatusBadgeProps {
  isLoading: boolean
  game: Game
  isOnline: boolean
  isReachable: boolean
  latency: number | null | undefined
}

function StatusBadge({ isLoading, game, isOnline, isReachable, latency }: StatusBadgeProps) {
  if (isLoading) {
    return (
      <span
        className="text-[9px] px-2 py-0.5 rounded-full"
        style={{ backgroundColor: 'rgba(107, 155, 122, 0.2)', color: 'var(--late-gray)' }}
      >
        检测中
      </span>
    )
  }

  if (!game.playable) {
    return (
      <span
        className="text-[9px] px-2 py-0.5 rounded-full"
        style={{ backgroundColor: 'rgba(139, 122, 155, 0.2)', color: 'var(--accent-purple)' }}
      >
        维护中
      </span>
    )
  }

  let bgColor: string
  let textColor: string

  if (!isOnline) {
    bgColor = 'rgba(234, 179, 8, 0.2)'
    textColor = 'var(--late-gray)'
  } else if (isReachable) {
    if (latency != null) {
      if (latency < 50) {
        bgColor = 'rgba(34, 197, 94, 0.2)'
        textColor = 'var(--late-green)'
      } else if (latency < 200) {
        bgColor = 'rgba(234, 179, 8, 0.2)'
        textColor = 'var(--late-yellow)'
      } else {
        bgColor = 'rgba(239, 68, 68, 0.2)'
        textColor = 'var(--late-red)'
      }
    } else {
      bgColor = 'rgba(34, 197, 94, 0.2)'
      textColor = 'var(--late-green)'
    }
  } else {
    bgColor = 'rgba(239, 68, 68, 0.2)'
    textColor = 'var(--late-red)'
  }

  const label = !isOnline ? '离线' : isReachable ? `可玩${latency != null ? ` · ${latency}ms` : ''}` : '不可用'
  const tooltip = isOnline ? `延迟 ${latency ?? '--'}ms | 更新于 刚刚` : '网络已断开'

  return (
    <span
      className="text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 group/-status relative"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <span className="w-1 h-1 rounded-full bg-current opacity-60" />
      {label}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[10px] whitespace-nowrap opacity-0 group-hover/-status:opacity-100 transition-opacity delay-150 duration-200 pointer-events-none z-10">
        {tooltip}
      </span>
    </span>
  )
}

const GameCard = memo(function GameCard({ game, index, onKeyDown, tabIndex = 0, lastPlayedAt }: GameCardProps) {
  const { status, isLoading } = useGameStatus()
  const { favorites, toggleFavorite } = useFavorites()
  const { getRatingStats, rateGame } = useGameRatings()
  const gameStatus = status[game.slug]
  const isReachable = gameStatus?.reachable ?? false
  const isFavorited = favorites.includes(game.slug)
  const [isOnline, setIsOnline] = useState(true)
  const [favoriteAnimating, setFavoriteAnimating] = useState(false)
  const prevStatusRef = useRef(gameStatus)
  const [statusPulse, setStatusPulse] = useState(false)
  const ratingStats = getRatingStats(game.slug)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (prevStatusRef.current?.reachable !== gameStatus?.reachable) {
      if (gameStatus?.reachable === true) {
        setStatusPulse(true)
        setTimeout(() => setStatusPulse(false), 600)
      }
    }
    prevStatusRef.current = gameStatus
  }, [gameStatus])

  const handleFavoriteClick = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (!isFavorited) {
      setFavoriteAnimating(true)
      setTimeout(() => setFavoriteAnimating(false), 300)
    }
    toggleFavorite(game.slug)
  }

  return (
    <Link
      href={`/games/${game.slug}`}
      className="block animate-fade-in-up focus-visible:outline-none"
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
    >
      <TouchGestures game={game} isFavorited={isFavorited} onFavorite={handleFavoriteClick}>
      <TiltCard>
        <div className={`
          group relative bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden
          transition-all duration-300 ease-out
          group-hover:scale-[1.02] group-hover:-translate-y-1
          focus-within:ring-2 focus-within:ring-[var(--accent-copper)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-primary)]
          ${statusPulse ? ' card-status-pulse' : ''}
        `}
          style={{
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03), 0 2px 8px rgba(0,0,0,0.2)`,
          }}
        >
          {/* Noise texture overlay */}
          <div className="noise-overlay rounded-2xl" aria-hidden="true" />

          {/* Breathing glow effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
            style={{
              boxShadow: `inset 0 0 80px ${game.glowColor}30`,
              animation: 'glow-breathe 3s ease-in-out infinite',
            }}
          />

          {/* Top accent line - 渐变增强 */}
          <div
            className="h-0.5 w-full transition-all duration-300"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${game.color}80 50%, transparent 100%)`,
              boxShadow: `0 0 12px ${game.color}40`,
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${game.color} 50%, transparent 100%)`,
              boxShadow: `0 0 8px ${game.color}`,
            }}
          />

          {/* Screenshot area */}
          <div className="relative h-32 overflow-hidden">
            <GameScreenshot game={game} />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />

            {/* Favorite button */}
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 active:scale-95 hover:scale-110 ${isFavorited ? (favoriteAnimating ? 'animate-favorite-burst' : 'animate-pulse-once') : ''}`}
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
          <div className="p-4 flex flex-col min-h-[180px]">
            {/* Metadata row */}
            <div className="flex items-center gap-2 mb-2 flex-wrap leading-none overflow-visible">
              <DifficultyStars level={game.difficulty} />
              <span className="text-[10px] text-[var(--text-muted)] opacity-40">|</span>
              <span className="text-[10px] text-[var(--text-muted)]">{game.playerCount}</span>
              <span className="text-[10px] text-[var(--text-muted)] opacity-40">|</span>
              <RatingStars gameSlug={game.slug} stats={ratingStats} onRate={(r) => rateGame(game.slug, r)} />
              {lastPlayedAt && (
                <>
                  <span className="text-[10px] text-[var(--text-muted)] opacity-40">|</span>
                  <span className="text-[10px]" style={{ color: 'var(--accent-copper)' }}>
                    {formatTimeAgo(lastPlayedAt)}
                  </span>
                </>
              )}
              <StatusBadge
                isLoading={isLoading}
                game={game}
                isOnline={isOnline}
                isReachable={isReachable}
                latency={gameStatus?.latency}
              />
            </div>
            {/* Category badge - always on new line */}
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap self-start"
              style={{
                backgroundColor: `${GAME_CATEGORIES[game.category].color}15`,
                border: `1px solid ${GAME_CATEGORIES[game.category].color}40`,
                color: GAME_CATEGORIES[game.category].color,
              }}
            >
              {GAME_CATEGORIES[game.category].label}
            </span>

            {/* Game title */}
            <h3
              className="text-xl mb-1 transition-colors duration-300 group-hover:translate-x-1"
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
            <div className="mt-auto pt-3">
              <span
                className="text-xs inline-flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:gap-2"
                style={{ color: game.color }}
              >
                进入游戏
                <svg
                  className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 6h8M7 3l3 3-3 3" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </TiltCard>
      </TouchGestures>
    </Link>
  )
})

export default GameCard
