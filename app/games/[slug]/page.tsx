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
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 text-sm flex items-center gap-2"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        <div className="flex-1 flex justify-center">
          <h1
            className="text-lg"
            style={{
              color: game.color,
              fontFamily: "'Noto Serif SC', serif",
            }}
          >
            {game.title}
          </h1>
        </div>

        <div className="w-20" />
      </div>

      {/* Game metadata bar */}
      <div className="flex items-center justify-center gap-6 py-3 border-b border-[var(--bg-card)] bg-[var(--bg-primary)]/50">
        <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <span>难度</span>
          <span style={{ color: game.color }}>{'★'.repeat(game.difficulty)}{'☆'.repeat(5 - game.difficulty)}</span>
        </span>
        <span className="w-px h-3 bg-[var(--border-subtle)]" />
        <span className="text-xs text-[var(--text-secondary)]">
          <span className="text-[var(--text-muted)]">玩家</span> {game.playerCount}
        </span>
        <span className="w-px h-3 bg-[var(--border-subtle)]" />
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            game.playable
              ? 'bg-emerald-900/40 text-emerald-400'
              : 'bg-amber-900/40 text-amber-400'
          }`}
        >
          {game.playable ? '可玩' : '维护中'}
        </span>
      </div>

      {/* Game iframe or maintenance state */}
      {!game.playable ? (
        <div className="w-full h-[calc(100vh-7rem)] flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b8945f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        <GameFrame game={game} />
      )}
    </div>
  )
}