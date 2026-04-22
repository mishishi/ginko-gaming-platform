'use client'

import { Game } from '@/lib/games'

interface GameIntroProps {
  game: Game
  onStart: () => void
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent-copper)" stroke="none" aria-hidden="true">
      <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  )
}

export default function GameIntro({ game, onStart }: GameIntroProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-12 relative">
      {/* Ambient glow background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${game.glowColor}20 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        {/* Game icon */}
        <div
          className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: `linear-gradient(135deg, ${game.color}30, ${game.color}10)`,
            boxShadow: `0 0 40px ${game.glowColor}40`,
          }}
        >
          <span className="text-5xl">
            {game.slug === 'idol' ? '🎴' : game.slug === 'quiz' ? '🧠' : '🔮'}
          </span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1
            className="text-4xl font-serif"
            style={{
              color: game.color,
              fontFamily: 'var(--font-serif), Noto Serif SC, serif',
              textShadow: `0 0 30px ${game.glowColor}`,
            }}
          >
            {game.title}
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            {game.subtitle}
          </p>
        </div>

        {/* Divider */}
        <div className="w-32 h-px mx-auto bg-gradient-to-r from-transparent via-[var(--accent-copper)] to-transparent opacity-50" />

        {/* Stats */}
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <StarIcon />
            <span style={{ color: game.color }}>
              {'★'.repeat(game.difficulty)}{'☆'.repeat(5 - game.difficulty)}
            </span>
            <span className="text-[var(--text-muted)] text-sm">难度</span>
          </div>
          <div className="w-px h-4 bg-[var(--border-subtle)]" />
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <UserIcon />
            <span>{game.playerCount}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[var(--text-secondary)] leading-relaxed px-4">
          {game.description}
        </p>

        {/* Start button */}
        <button
          onClick={onStart}
          className="group relative px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${game.color}, ${game.color}cc)`,
            boxShadow: `0 4px 20px ${game.glowColor}60`,
          }}
        >
          <span className="flex items-center gap-3 text-white">
            <PlayIcon />
            开始游戏
          </span>
          {/* Hover glow effect */}
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${game.color}, transparent)`,
              filter: 'blur(10px)',
              zIndex: -1,
            }}
          />
        </button>

        {/* Tips */}
        <p className="text-xs text-[var(--text-muted)]">
          按 <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono text-[10px]">F</kbd> 进入全屏获得最佳体验
        </p>
      </div>
    </div>
  )
}
