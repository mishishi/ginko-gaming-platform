'use client'

import { useState, useRef, useEffect } from 'react'
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
  lastPlayedAt?: number
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [isPressed, setIsPressed] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isPressed) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -4
    const rotateY = ((x - centerX) / centerX) * 4
    setTilt({ rotateX, rotateY })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || isPressed || e.touches.length === 0) return
    const touch = e.touches[0]
    const rect = cardRef.current.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    // Milder tilt on touch devices
    const rotateX = ((y - centerY) / centerY) * -2
    const rotateY = ((x - centerX) / centerX) * 2
    setTilt({ rotateX, rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  const handleMouseDown = () => setIsPressed(true)
  const handleMouseUp = () => setIsPressed(false)

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
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isPressed ? 0.97 : 1})`,
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

export default function GameCard({ game, index, onKeyDown, tabIndex = 0, lastPlayedAt }: GameCardProps) {
  const { status, isLoading } = useGameStatus()
  const { favorites, toggleFavorite } = useFavorites()
  const gameStatus = status[game.slug]
  const isReachable = gameStatus?.reachable ?? false
  const isFavorited = favorites.includes(game.slug)
  const [isOnline, setIsOnline] = useState(true)

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
        <div className="group relative bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-0.5 hover:shadow-lg">
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
              className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${isFavorited ? 'animate-pulse-once' : ''}`}
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
              {lastPlayedAt && (
                <>
                  <span className="text-[10px] text-[var(--text-muted)] opacity-40">|</span>
                  <span className="text-[10px]" style={{ color: 'var(--accent-copper)' }}>
                    {formatTimeAgo(lastPlayedAt)}
                  </span>
                </>
              )}
              {!isOnline && game.playable ? (
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: 'rgba(212, 132, 90, 0.2)', color: 'var(--accent-orange)' }}
                  aria-label="网络离线，此游戏不可用"
                >
                  离线
                </span>
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
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[10px] whitespace-nowrap opacity-0 group-hover/status:opacity-100 transition-opacity pointer-events-none z-10">
                    {gameStatus.latency != null && (
                      <>
                        {gameStatus.latency < 50 ? '极低延迟' :
                         gameStatus.latency < 100 ? '低延迟' :
                         gameStatus.latency < 200 ? '中等延迟' :
                         gameStatus.latency < 500 ? '较高延迟' : '高延迟'}
                        <span className="opacity-50 ml-1">{gameStatus.latency}ms</span>
                      </>
                    )}
                  </span>
                </span>
              ) : game.playable ? (
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: 'rgba(139, 122, 139, 0.2)', color: 'var(--text-muted)' }}
                >
                  不可用
                </span>
              ) : (
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: 'rgba(139, 122, 155, 0.2)', color: 'var(--accent-purple)' }}
                >
                  维护中
                </span>
              )}
            </div>

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
            <div className="mt-3">
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
    </Link>
  )
}
