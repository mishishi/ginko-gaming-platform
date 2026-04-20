import { notFound } from 'next/navigation'
import Link from 'next/link'
import { games, getGameBySlug } from '@/lib/games'
import GameFrame from '@/components/GameFrame'

interface GamePageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return games.map((game) => ({
    slug: game.slug,
  }))
}

export async function generateMetadata({ params }: GamePageProps) {
  const game = getGameBySlug(params.slug)
  if (!game) return {}

  return {
    title: `${game.title} - 银古客栈`,
    description: game.description,
  }
}

export default function GamePage({ params }: GamePageProps) {
  const game = getGameBySlug(params.slug)

  if (!game) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Mini nav bar */}
      <div className="h-12 flex items-center px-4 border-b border-[var(--bg-card)] bg-[var(--bg-primary)]/90 backdrop-blur-sm">
        <Link
          href="/"
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 text-sm"
        >
          ← 返回首页
        </Link>

        <div className="flex-1 flex justify-center">
          <nav aria-label="面包屑导航">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200"
                >
                  首页
                </Link>
              </li>
              <li className="text-[var(--text-muted)]" aria-hidden="true">/</li>
              <li>
                <span
                  style={{
                    color: game.color,
                    fontFamily: "'Noto Serif SC', serif",
                  }}
                >
                  {game.title}
                </span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="w-20" />
      </div>

      {/* Game metadata bar with icons */}
      <div className="flex items-center justify-center gap-5 py-3 border-b border-[var(--bg-card)] bg-[var(--bg-primary)]/30">
        {/* Difficulty with star icon */}
        <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--accent-amber)" stroke="none">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
          <span style={{ color: game.color }}>{'★'.repeat(game.difficulty)}{'☆'.repeat(5 - game.difficulty)}</span>
        </span>

        <span className="w-px h-3 bg-[var(--border-subtle)]" />

        {/* Player count with user icon */}
        <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-[var(--text-muted)]">玩家</span>
          <span>{game.playerCount}</span>
        </span>

        <span className="w-px h-3 bg-[var(--border-subtle)]" />

        {/* Status badge */}
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{
            backgroundColor: game.playable ? 'rgba(74, 92, 79, 0.4)' : 'rgba(184, 148, 95, 0.4)',
            color: game.playable ? 'var(--accent-green)' : 'var(--accent-amber)',
          }}
        >
          {game.playable ? '可玩' : '维护中'}
        </span>
      </div>

      {/* Game iframe or maintenance state */}
      {!game.playable ? (
        <div className="w-full h-[calc(100vh-7rem)] flex flex-col items-center justify-center gap-6 relative">
          {/* Ambient glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none opacity-30"
            style={{
              background: `radial-gradient(circle, ${game.glowColor}30 0%, transparent 70%)`,
              animation: 'glow-breathe 4s ease-in-out infinite',
            }}
          />

          {/* Floating lantern */}
          <div
            className="absolute top-12 left-1/2 -translate-x-1/2 pointer-events-none opacity-30"
            style={{ animation: 'float 6s ease-in-out infinite' }}
            aria-hidden="true"
          >
            <svg width="32" height="42" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="24" cy="36" rx="10" ry="14" fill="var(--accent-amber)" />
              <rect x="19" y="18" width="10" height="6" rx="2" fill="var(--accent-amber)" opacity="0.7" />
              <rect x="22" y="12" width="4" height="6" rx="1" fill="var(--accent-amber)" opacity="0.5" />
            </svg>
          </div>

          {/* Warning icon with breathing glow */}
          <div
            className="w-16 h-16 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center relative"
            style={{
              animation: 'glow-breathe 3s ease-in-out infinite',
              boxShadow: `0 0 30px ${game.glowColor}20`,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={game.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-xl text-[var(--text-primary)] mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              游戏维护中
            </h2>
            <p className="text-[var(--text-secondary)] text-sm">
              这款游戏正在休息，请稍后再来
            </p>
          </div>
          <Link
            href="/"
            className="mt-2 px-5 py-2 rounded-lg text-sm font-medium border transition-all duration-200 hover:bg-[var(--bg-card)]"
            style={{ color: 'var(--accent-amber)', borderColor: 'var(--accent-amber)40' }}
          >
            返回首页
          </Link>
        </div>
      ) : (
        /* Game iframe with decorative frame */
        <div className="relative">
          {/* Decorative inner border */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              boxShadow: `inset 0 0 0 1px ${game.color}15, inset 0 0 60px ${game.color}08`,
            }}
          />
          <GameFrame game={game} />
        </div>
      )}
    </div>
  )
}