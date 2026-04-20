'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Game } from '@/lib/games'
import { useGameStatus } from './GameStatusProvider'

interface GameCardProps {
  game: Game
  index: number
}

interface TiltCardProps {
  game: Game
  index: number
  children: React.ReactNode
}

function TiltCard({ game, index, children }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const isMobile = typeof window !== 'undefined' && 'ontouchstart' in window

  const handleMove = (clientX: number, clientY: number) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    // Reduced intensity on mobile for subtler effect
    const intensity = isMobile ? 4 : 6
    const rotateX = ((y - centerY) / centerY) * -intensity
    const rotateY = ((x - centerX) / centerX) * intensity
    setTilt({ rotateX, rotateY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX, e.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  const handleTouchEnd = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  return (
    <div
      ref={cardRef}
      className="relative"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
    <span className="text-xs tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
      {'★'.repeat(level)}{'☆'.repeat(5 - level)}
    </span>
  )
}

function StatusBadge({ game, isReachable }: { game: Game; isReachable: boolean }) {
  const status = game.playable && isReachable ? 'online' : game.playable ? 'reachable' : 'maintenance'

  return (
    <span
      className="text-[9px] px-1.5 py-0.5 rounded font-medium"
      style={{
        backgroundColor:
          status === 'online'
            ? 'rgba(74, 92, 79, 0.6)'
            : status === 'reachable'
              ? 'rgba(74, 92, 79, 0.3)'
              : 'rgba(184, 148, 95, 0.6)',
        color:
          status === 'online'
            ? 'var(--accent-green)'
            : status === 'reachable'
              ? 'var(--accent-green)'
              : 'var(--accent-amber)',
      }}
    >
      {status === 'online' ? '可玩' : status === 'reachable' ? '离线' : '维护中'}
    </span>
  )
}

export default function GameCard({ game, index }: GameCardProps) {
  const staggerClass = `stagger-${index + 1}`
  const { status } = useGameStatus()
  const gameStatus = status[game.slug]
  const isReachable = gameStatus?.reachable ?? false

  return (
    <Link href={`/games/${game.slug}`} className={`block animate-fade-in-up ${staggerClass}`}>
      <TiltCard game={game} index={index}>
        <div className="group relative">
        {/* Card container */}
        <div
          className="relative bg-[var(--bg-card)] rounded-2xl overflow-hidden transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:-translate-y-1"
          style={{
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03), 0 2px 8px rgba(0,0,0,0.2)`,
          }}
        >
          {/* Noise texture overlay */}
          <div className="noise-overlay rounded-2xl" aria-hidden="true" />
          {/* Theme gradient placeholder */}
          <div
            className="h-36 w-full relative overflow-hidden"
            style={{ background: game.theme }}
          >
            {/* Decorative pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, ${game.color}40 0%, transparent 50%),
                                  radial-gradient(circle at 75% 75%, ${game.color}30 0%, transparent 50%)`,
              }}
            />
            {/* Top decorative line */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(90deg, transparent, ${game.color}60, transparent)`,
              }}
            />
            {/* Bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-70" />
          </div>

          {/* Top color glow bar */}
          <div
            className="h-1 w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${game.color}40, transparent)`,
            }}
          />

          {/* Card content */}
          <div className="p-6">
            {/* Metadata row */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <DifficultyStars level={game.difficulty} />
              <span className="text-[10px] text-[var(--text-secondary)] opacity-60">|</span>
              <span className="text-[10px] text-[var(--text-secondary)]">{game.playerCount}</span>
              <span className="text-[10px] text-[var(--text-secondary)] opacity-60">|</span>
              <StatusBadge game={game} isReachable={isReachable} />
            </div>

            {/* Game title */}
            <h3
              className="text-2xl mb-2 transition-colors duration-300 group-hover:brightness-110"
              style={{
                color: game.color,
                fontFamily: 'var(--font-serif), Noto Serif SC, serif',
              }}
            >
              {game.title}
            </h3>

            {/* Subtitle */}
            <p className="text-[var(--text-primary)] text-sm mb-4">
              {game.subtitle}
            </p>

            {/* Description */}
            <p className="text-[var(--text-secondary)] text-xs mb-6">
              {game.description}
            </p>

            {/* Bottom CTA - spring animation on appear */}
            <div className="flex items-center justify-center min-h-[3rem] -my-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-hover:scale-100 scale-95 md:translate-y-0 translate-y-2 transition-all duration-300 ease-out">
              <span
                className="px-5 py-2 rounded-lg text-xs font-medium border"
                style={{
                  color: game.color,
                  borderColor: `${game.color}50`,
                  backgroundColor: `${game.color}08`,
                  boxShadow: `0 0 20px ${game.color}15`,
                }}
              >
                进入游戏
              </span>
            </div>
          </div>

          {/* Hover glow effect - breathing animation */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
            style={{
              boxShadow: `inset 0 0 80px ${game.glowColor}30`,
              animation: 'glow-breathe 3s ease-in-out infinite',
            }}
          />

          {/* Collection number */}
          <div
            className="absolute bottom-4 right-5 text-xs font-mono tabular-nums opacity-20 group-hover:opacity-40 transition-opacity duration-300"
            style={{ color: game.color }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>
        </div>

        {/* Glow shadow on hover */}
        <div
          className="absolute -inset-1 opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10 blur-xl"
          style={{
            background: game.glowColor,
          }}
        />
      </div>
      </TiltCard>
    </Link>
  )
}
