'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getGameBySlug } from '@/lib/games'
import { useGameStats } from '@/hooks/useGameStats'
import { useCheckInContext } from '@/contexts/CheckInContext'
import LeaderboardPanel from '@/components/LeaderboardPanel'

interface GameInfoPageProps {
  params: {
    slug: string
  }
}

export default function GameInfoPage({ params }: GameInfoPageProps) {
  const game = getGameBySlug(params.slug)
  const { stats, unlockedIds } = useGameStats()
  const { checkInData } = useCheckInContext()
  const [selectedTab, setSelectedTab] = useState<'info' | 'leaderboard' | 'achievements'>('info')

  if (!game) {
    notFound()
  }

  const gameStats = {
    playCount: stats.playCount[game.slug] || 0,
    highScore: stats.highScore[game.slug] || 0,
    lastPlayed: stats.lastPlayedAt[game.slug] || null,
  }

  // Get achievements related to this game
  const gameAchievements = unlockedIds.filter(id =>
    id.includes(game.slug) || id === 'all_games' || id === 'perfect_score'
  )

  const tabs = [
    { id: 'info', label: '游戏介绍' },
    { id: 'leaderboard', label: '排行榜' },
    { id: 'achievements', label: '成就进度' },
  ] as const

  return (
    <div className="min-h-screen pb-16">
      {/* Mini nav bar */}
      <div className="h-12 flex items-center px-4 border-b border-[var(--bg-card)] bg-[var(--bg-primary)]/90 backdrop-blur-sm sticky top-14 z-30">
        <Link
          href={`/games/${game.slug}`}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 text-sm"
        >
          ← 返回游戏
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
                <Link
                  href={`/games/${game.slug}`}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200"
                >
                  {game.title}
                </Link>
              </li>
              <li className="text-[var(--text-muted)]" aria-hidden="true">/</li>
              <li>
                <span style={{ color: game.color }}>
                  详情
                </span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="w-20" />
      </div>

      {/* Hero section */}
      <div
        className="relative py-16 px-4 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${game.color}08 0%, transparent 100%)`,
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none opacity-50"
          style={{
            background: `radial-gradient(ellipse, ${game.glowColor}30 0%, transparent 70%)`,
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Game icon */}
          <div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: `linear-gradient(135deg, ${game.color}30, ${game.color}10)`,
              boxShadow: `0 0 40px ${game.glowColor}40`,
            }}
          >
            <span className="text-4xl">
              {game.slug === 'idol' ? '🎴' : game.slug === 'quiz' ? '🧠' : '🔮'}
            </span>
          </div>

          <h1
            className="text-4xl font-serif mb-3"
            style={{
              color: game.color,
              fontFamily: 'var(--font-serif), Noto Serif SC, serif',
              textShadow: `0 0 30px ${game.glowColor}`,
            }}
          >
            {game.title}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-6">
            {game.subtitle}
          </p>

          {/* Quick stats */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>难度</span>
              <span style={{ color: game.color }}>
                {'★'.repeat(game.difficulty)}{'☆'.repeat(5 - game.difficulty)}
              </span>
            </div>
            <div className="w-px h-4 bg-[var(--border-subtle)]" />
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>玩家</span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{game.playerCount}</span>
            </div>
            {gameStats.highScore > 0 && (
              <>
                <div className="w-px h-4 bg-[var(--border-subtle)]" />
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>最高分</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--accent-copper)' }}>{gameStats.highScore}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[104px] z-20 border-b border-[var(--border-subtle)]" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <nav className="flex gap-1" aria-label="标签导航">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id)}
                className={`
                  px-4 py-3 text-sm font-medium transition-all duration-200
                  border-b-2 -mb-px
                  ${selectedTab === tab.id
                    ? 'border-[var(--accent-copper)] text-[var(--accent-copper)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }
                `}
                aria-current={selectedTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {selectedTab === 'info' && (
          <div className="space-y-8">
            {/* Description */}
            <section className="p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
                游戏介绍
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {game.description}
              </p>
            </section>

            {/* My stats */}
            <section className="p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
                我的记录
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--accent-copper)' }}>
                    {gameStats.playCount}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>游玩次数</div>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--accent-copper)' }}>
                    {gameStats.highScore}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>最高分</div>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--accent-copper)' }}>
                    {checkInData.streak}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>连续签到</div>
                </div>
              </div>
              {gameStats.lastPlayed && (
                <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
                  最后游玩: {new Date(gameStats.lastPlayed).toLocaleDateString('zh-CN')}
                </p>
              )}
            </section>

            {/* How to play */}
            <section className="p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
                游戏指南
              </h2>
              <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {game.slug === 'idol' && (
                  <>
                    <p>🎴 按照节拍点击屏幕上的音符</p>
                    <p>🎵 连续正确的节拍可以获得连击加分</p>
                    <p>⭐ 完成整首歌曲可获得更高评价</p>
                  </>
                )}
                {game.slug === 'quiz' && (
                  <>
                    <p>🧠 阅读问题并选择正确答案</p>
                    <p>⚡ 答题速度越快，得分越高</p>
                    <p>💡 注意：答错会扣分哦</p>
                  </>
                )}
                {game.slug === 'fate' && (
                  <>
                    <p>🎲 组合不同的卡牌形成策略</p>
                    <p>⚔️ 合理利用属性相克关系</p>
                    <p>🏆 达到特定条件可触发稀有成就</p>
                  </>
                )}
              </div>
            </section>

            {/* Start button */}
            <Link
              href={`/games/${game.slug}`}
              className="block w-full py-4 rounded-xl text-center font-medium text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${game.color}, ${game.color}cc)`,
                boxShadow: `0 4px 20px ${game.glowColor}60`,
                color: 'white',
              }}
            >
              开始游戏
            </Link>
          </div>
        )}

        {selectedTab === 'leaderboard' && (
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <LeaderboardPanel gameSlug={game.slug} />
          </div>
        )}

        {selectedTab === 'achievements' && (
          <div className="space-y-4">
            <div className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              已解锁 {unlockedIds.length} / 11 成就
            </div>
            {/* Show achievement progress for this game */}
            {['first_play', `${game.slug}_master`, 'all_games', 'perfect_score'].map((achievementId) => {
              const isUnlocked = unlockedIds.includes(achievementId as any)
              const achievementNames: Record<string, string> = {
                first_play: '初次游玩',
                idol_master: '偶像大师',
                quiz_master: '知识达人',
                fate_explorer: '命运探索者',
                all_games: '全能玩家',
                perfect_score: '完美得分',
              }
              return (
                <div
                  key={achievementId}
                  className="flex items-center gap-4 p-4 rounded-lg transition-all"
                  style={{
                    backgroundColor: isUnlocked ? 'var(--bg-card)' : 'var(--bg-secondary)',
                    opacity: isUnlocked ? 1 : 0.5,
                    border: `1px solid ${isUnlocked ? 'var(--accent-copper)/30' : 'var(--border-subtle)'}`,
                  }}
                >
                  <div className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                    {isUnlocked ? '🏆' : '🔒'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {achievementNames[achievementId] || achievementId}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {isUnlocked ? '已解锁' : '未解锁'}
                    </div>
                  </div>
                  {isUnlocked && (
                    <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--accent-copper)/20', color: 'var(--accent-copper)' }}>
                      ✓
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
