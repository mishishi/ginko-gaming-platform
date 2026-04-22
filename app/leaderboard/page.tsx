'use client'

import Head from 'next/head'
import { useState } from 'react'
import LeaderboardPanel from '@/components/LeaderboardPanel'

const GAMES = [
  { slug: 'idol', name: '偶像', icon: '🎤', description: '音乐节奏游戏' },
  { slug: 'quiz', name: '竞技', icon: '🧠', description: '知识问答挑战' },
  { slug: 'fate', name: '命运', icon: '🎲', description: '卡牌策略游戏' },
]

export default function LeaderboardPage() {
  const [selectedGame, setSelectedGame] = useState('idol')

  const currentGame = GAMES.find(g => g.slug === selectedGame) || GAMES[0]

  return (
    <>
      <Head>
        <title>排行榜 - 银古客栈</title>
        <meta name="description" content="查看游戏排行榜，挑战全球玩家" />
      </Head>

      <main className="min-h-screen pt-14 pb-16">
        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="font-serif text-4xl mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif), Noto Serif SC, serif' }}>
              🏆 排行榜
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              挑战全球玩家，争夺至高荣耀
            </p>
          </header>

          {/* Game Selector */}
          <div className="flex justify-center gap-3 mb-8">
            {GAMES.map((game) => (
              <button
                key={game.slug}
                type="button"
                onClick={() => setSelectedGame(game.slug)}
                className={`
                  flex flex-col items-center gap-1 px-5 py-3 rounded-xl
                  transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[var(--accent-copper)] focus:ring-offset-2
                  ${selectedGame === game.slug
                    ? 'scale-105'
                    : 'opacity-60 hover:opacity-100 hover:scale-[1.02]'
                  }
                `}
                style={{
                  backgroundColor: selectedGame === game.slug ? 'var(--bg-card)' : 'transparent',
                  border: selectedGame === game.slug ? '1px solid var(--accent-copper)/30' : '1px solid transparent',
                }}
              >
                <span className="text-2xl" role="img" aria-hidden="true">{game.icon}</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: selectedGame === game.slug ? 'var(--accent-copper)' : 'var(--text-secondary)' }}
                >
                  {game.name}
                </span>
              </button>
            ))}
          </div>

          {/* Leaderboard Panel */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl" role="img" aria-hidden="true">{currentGame.icon}</span>
                <h2 className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
                  {currentGame.name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  {currentGame.description}
                </span>
              </div>
            </div>
            <LeaderboardPanel gameSlug={selectedGame} />
          </div>

          {/* Tips */}
          <section className="mt-12 p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
              💡 上榜技巧
            </h2>
            <ul className="text-xs space-y-2" style={{ color: 'var(--text-muted)' }}>
              <li>• 每款游戏有独立的排行榜系统</li>
              <li>• 进入游戏后，成绩会自动上报</li>
              <li>• 同一游戏多次挑战，保留最高分</li>
              <li>• 坚持签到可解锁稀有成就，提升排名</li>
            </ul>
          </section>
        </div>
      </main>
    </>
  )
}
