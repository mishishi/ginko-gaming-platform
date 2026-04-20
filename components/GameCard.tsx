'use client'

import Link from 'next/link'
import { Game } from '@/lib/games'

interface GameCardProps {
  game: Game
  index: number
}

function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="text-xs tracking-wide" style={{ color: '#a8a4a0' }}>
      {'★'.repeat(level)}{'☆'.repeat(5 - level)}
    </span>
  )
}

function StatusBadge({ playable }: { playable: boolean }) {
  return (
    <span
      className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
        playable ? 'bg-emerald-900/60 text-emerald-400' : 'bg-amber-900/60 text-amber-400'
      }`}
    >
      {playable ? '可玩' : '维护中'}
    </span>
  )
}

export default function GameCard({ game, index }: GameCardProps) {
  const staggerClass = `stagger-${index + 1}`

  return (
    <Link href={`/games/${game.slug}`} className={`block animate-fade-in-up ${staggerClass}`}>
      <div className="group relative">
        {/* Card container */}
        <div
          className="relative bg-[#1a1f24] rounded-2xl overflow-hidden transition-all duration-300 ease-out group-hover:-translate-y-2"
          style={{
            boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)`,
          }}
        >
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f24] via-transparent to-transparent opacity-70" />
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
              <span className="text-[10px] text-[#8a8680] opacity-60">|</span>
              <span className="text-[10px] text-[#8a8680]">{game.playerCount}</span>
              <span className="text-[10px] text-[#8a8680] opacity-60">|</span>
              <StatusBadge playable={game.playable} />
            </div>

            {/* Game title */}
            <h3
              className="text-2xl mb-2 transition-colors duration-300 group-hover:brightness-110"
              style={{
                color: game.color,
                fontFamily: "'Noto Serif SC', serif",
              }}
            >
              {game.title}
            </h3>

            {/* Subtitle */}
            <p className="text-[#e8e4df] text-sm mb-4">
              {game.subtitle}
            </p>

            {/* Description */}
            <p className="text-[#8a8680] text-xs mb-6">
              {game.description}
            </p>

            {/* Bottom CTA */}
            <div className="flex items-center justify-center min-h-[3rem] -my-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-0 group-hover:delay-100">
              <span
                className="px-4 py-1.5 rounded text-xs font-medium border"
                style={{
                  color: game.color,
                  borderColor: `${game.color}40`,
                  backgroundColor: `${game.color}10`,
                }}
              >
                进入游戏
              </span>
            </div>
          </div>

          {/* Hover glow effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 60px ${game.glowColor}`,
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
    </Link>
  )
}
