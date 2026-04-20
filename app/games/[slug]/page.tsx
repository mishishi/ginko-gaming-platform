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
    <div className="min-h-screen bg-[#0a0d0f]">
      {/* Mini nav bar */}
      <div className="h-12 flex items-center px-4 border-b border-[#1a1f24] bg-[#0a0d0f]/90 backdrop-blur-sm">
        <Link
          href="/"
          className="text-[#8a8680] hover:text-[#e8e4df] transition-colors duration-200 text-sm flex items-center gap-2"
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
      <div className="flex items-center justify-center gap-6 py-3 border-b border-[#1a1f24] bg-[#0a0d0f]/50">
        <span className="flex items-center gap-1.5 text-xs text-[#8a8680]">
          <span>难度</span>
          <span style={{ color: game.color }}>{'★'.repeat(game.difficulty)}{'☆'.repeat(5 - game.difficulty)}</span>
        </span>
        <span className="w-px h-3 bg-[#2a2d2f]" />
        <span className="text-xs text-[#8a8680]">
          <span className="text-[#6b6560]">玩家</span> {game.playerCount}
        </span>
        <span className="w-px h-3 bg-[#2a2d2f]" />
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

      {/* Game iframe */}
      <GameFrame game={game} />
    </div>
  )
}