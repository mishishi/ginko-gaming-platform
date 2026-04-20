'use client'

import Link from 'next/link'
import { Game } from '@/lib/games'

interface GameCardProps {
  game: Game
  index: number
}

export default function GameCard({ game, index }: GameCardProps) {
  const staggerClass = `stagger-${index + 1}`

  return (
    <Link href={`/games/${game.slug}`} className={`block animate-fade-in-up ${staggerClass}`}>
      <div className="group relative">
        {/* Card container */}
        <div className="relative bg-[#1a1f24] rounded-2xl overflow-hidden transition-all duration-300 ease-out group-hover:-translate-y-2"
          style={{
            boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)`,
          }}
        >
          {/* Top color glow bar */}
          <div
            className="h-1 w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${game.color}40, transparent)`,
            }}
          />

          {/* Card content */}
          <div className="p-6">
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

            {/* Bottom accent line */}
            <div className="flex items-center gap-3">
              <div
                className="h-px flex-1"
                style={{
                  background: `linear-gradient(90deg, ${game.color}60, transparent)`,
                }}
              />
              <span
                className="text-xs opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: game.color }}
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