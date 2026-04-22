'use client'

import { useState, useEffect } from 'react'
import { ACHIEVEMENTS_CONFIG, RARITY_CONFIG, type AchievementId, type AchievementRarity } from '@/components/AchievementBadge'
import AchievementBadge from '@/components/AchievementBadge'
import LeaderboardPanel from '@/components/LeaderboardPanel'

const STATS_KEY = 'yinqiu-stats'
const TEST_GAME_SLUG = 'test-game'
const TEST_PLAYER_KEY = 'yinqiu-test-player'

interface GameStats {
  playCount: Record<string, number>
  highScore: Record<string, number>
  lastPlayedAt: Record<string, string>
  achievements: string[]
}

export default function TestAchievementsPage() {
  const [unlockedIds, setUnlockedIds] = useState<AchievementId[]>([])
  const [stats, setStats] = useState<GameStats | null>(null)
  const [playerName, setPlayerName] = useState<string>('')
  const [scoreInput, setScoreInput] = useState<string>('')
  const [submitResult, setSubmitResult] = useState<{ rank: number; isNewHighScore: boolean } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    // Load current stats from localStorage
    try {
      const stored = localStorage.getItem(STATS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as GameStats
        setUnlockedIds(parsed.achievements as AchievementId[])
        setStats(parsed)
      }
    } catch (e) {
      console.warn('Failed to load stats:', e)
    }

    // Load saved player name
    const savedName = localStorage.getItem(TEST_PLAYER_KEY)
    if (savedName) setPlayerName(savedName)
  }, [])

  const toggleAchievement = (id: AchievementId) => {
    const newUnlocked = unlockedIds.includes(id)
      ? unlockedIds.filter(a => a !== id)
      : [...unlockedIds, id]

    setUnlockedIds(newUnlocked)

    // Update localStorage
    try {
      const current = stats || { playCount: {}, highScore: {}, lastPlayedAt: {}, achievements: [] }
      const updated: GameStats = {
        ...current,
        achievements: newUnlocked,
      }
      localStorage.setItem(STATS_KEY, JSON.stringify(updated))
      setStats(updated)
    } catch (e) {
      console.warn('Failed to save:', e)
    }
  }

  const resetAll = () => {
    setUnlockedIds([])
    try {
      localStorage.removeItem(STATS_KEY)
      setStats({ playCount: {}, highScore: {}, lastPlayedAt: {}, achievements: [] })
    } catch (e) {
      console.warn('Failed to reset:', e)
    }
  }

  const handleSubmitScore = async () => {
    const score = parseInt(scoreInput, 10)
    if (isNaN(score) || score < 0) {
      alert('请输入有效的分数')
      return
    }

    const name = playerName.trim() || '匿名玩家'
    localStorage.setItem(TEST_PLAYER_KEY, name)

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameSlug: TEST_GAME_SLUG,
          score,
          playerName: name,
        }),
      })
      const result = await response.json()
      setSubmitResult({ rank: result.rank, isNewHighScore: result.isNewHighScore })
      setRefreshKey(k => k + 1)
    } catch (e) {
      console.error('Failed to submit score:', e)
      alert('提交失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetLeaderboard = () => {
    localStorage.removeItem('yinqiu-leaderboard')
    setSubmitResult(null)
    setRefreshKey(k => k + 1)
  }

  const achievements = Object.values(ACHIEVEMENTS_CONFIG)

  const rarityOrder: AchievementRarity[] = ['legendary', 'epic', 'rare', 'common']

  const groupedByRarity = rarityOrder.reduce((acc, rarity) => {
    acc[rarity] = achievements.filter(a => a.rarity === rarity)
    return acc
  }, {} as Record<AchievementRarity, typeof achievements>)

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif mb-2" style={{ color: 'var(--text-primary)' }}>
            成就系统测试页
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            点击成就可切换解锁状态，数据存储在 localStorage
          </p>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div
            className="mb-8 p-4 rounded-xl border"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
              当前统计数据
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div style={{ color: 'var(--text-muted)' }}>总游玩次数</div>
                <div className="text-xl font-medium" style={{ color: 'var(--accent-copper)' }}>
                  {Object.values(stats.playCount).reduce((a, b) => a + b, 0)}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>已解锁成就</div>
                <div className="text-xl font-medium" style={{ color: 'var(--accent-copper)' }}>
                  {unlockedIds.length}/{achievements.length}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>最高总分</div>
                <div className="text-xl font-medium" style={{ color: 'var(--accent-copper)' }}>
                  {Object.values(stats.highScore).reduce((a, b) => a + b, 0)}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>玩过的游戏</div>
                <div className="text-xl font-medium" style={{ color: 'var(--accent-copper)' }}>
                  {Object.keys(stats.playCount).length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={resetAll}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: 'rgba(212, 132, 90, 0.2)',
              border: '1px solid var(--accent-orange)',
              color: 'var(--accent-orange)',
            }}
          >
            重置所有数据
          </button>
        </div>

        {/* Achievement List by Rarity */}
        {rarityOrder.map(rarity => (
          <div key={rarity} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: RARITY_CONFIG[rarity].border }}
              />
              <h2
                className="text-sm font-medium uppercase tracking-wider"
                style={{ color: RARITY_CONFIG[rarity].border }}
              >
                {RARITY_CONFIG[rarity].label}
              </h2>
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: 'var(--border-subtle)' }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedByRarity[rarity].map(achievement => {
                const isUnlocked = unlockedIds.includes(achievement.id)
                return (
                  <div
                    key={achievement.id}
                    onClick={() => toggleAchievement(achievement.id)}
                    className={`
                      p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                      hover:scale-[1.02] active:scale-[0.98]
                      ${isUnlocked ? 'border-solid' : 'border-dashed'}
                    `}
                    style={{
                      backgroundColor: isUnlocked
                        ? RARITY_CONFIG[rarity].bg
                        : 'var(--bg-elevated)',
                      borderColor: isUnlocked
                        ? RARITY_CONFIG[rarity].border
                        : 'var(--border-subtle)',
                      boxShadow: isUnlocked
                        ? `0 0 20px ${RARITY_CONFIG[rarity].glow}`
                        : 'none',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <AchievementBadge
                        achievement={achievement}
                        isUnlocked={isUnlocked}
                        showRarity={false}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className="font-medium truncate"
                            style={{ color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}
                          >
                            {achievement.name}
                          </h3>
                        </div>
                        <p
                          className="text-xs"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: RARITY_CONFIG[rarity].bg,
                              border: `1px solid ${RARITY_CONFIG[rarity].border}`,
                              color: RARITY_CONFIG[rarity].border,
                            }}
                          >
                            {RARITY_CONFIG[rarity].label}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: isUnlocked ? 'var(--accent-green)' : 'var(--text-muted)' }}
                          >
                            {isUnlocked ? '已解锁' : '未解锁'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Instructions */}
        <div
          className="mt-12 p-4 rounded-xl border text-center text-sm"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <p>点击任意成就卡片可切换解锁状态</p>
          <p className="mt-1">数据会同步保存到 localStorage 的 yinqiu-stats 键</p>
        </div>

        {/* Leaderboard Test Section */}
        <div className="mt-12">
          <h2 className="text-xl font-serif mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
            排行榜功能测试
          </h2>

          {/* Score Submission Form */}
          <div
            className="mb-8 p-4 rounded-xl border"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
              提交分数
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="player-name" className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  玩家名称
                </label>
                <input
                  id="player-name"
                  type="text"
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  placeholder="输入你的名字"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="score-input" className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  分数
                </label>
                <input
                  id="score-input"
                  type="number"
                  value={scoreInput}
                  onChange={e => setScoreInput(e.target.value)}
                  placeholder="输入分数"
                  min="0"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSubmitScore}
                  disabled={isSubmitting || !scoreInput}
                  className="px-6 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--accent-copper)',
                    color: 'var(--bg-primary)',
                  }}
                >
                  {isSubmitting ? '提交中...' : '提交'}
                </button>
              </div>
            </div>

            {/* Submit Result */}
            {submitResult && (
              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(74, 92, 79, 0.2)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg" role="img" aria-hidden="true">
                    {submitResult.isNewHighScore ? '🎉' : '✅'}
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {submitResult.isNewHighScore ? '新纪录！' : '分数已更新'}
                  </span>
                  <span style={{ color: 'var(--accent-copper)', fontWeight: 500 }}>
                    排名第 {submitResult.rank} 位
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LeaderboardPanel
              key={refreshKey}
              gameSlug={TEST_GAME_SLUG}
              currentPlayerName={playerName || undefined}
              title="测试游戏排行榜"
            />
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: 'rgba(74, 92, 79, 0.2)',
                border: '1px solid rgba(184, 148, 95, 0.3)',
              }}
            >
              <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--accent-copper)' }}>
                使用说明
              </h3>
              <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div>
                  <div className="font-medium mb-1">提交分数</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    输入玩家名称和分数，点击提交。同一玩家多次提交会保留最高分。
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-1">postMessage 方式</div>
                  <div className="text-xs font-mono p-2 rounded mt-1" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    {`window.parent.postMessage({\n  type: 'SCORE_REPORT',\n  score: 1000,\n  playerName: '玩家名'\n}, '*')`}
                  </div>
                </div>
                <div className="pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button
                    onClick={resetLeaderboard}
                    className="text-xs px-3 py-1.5 rounded transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: 'rgba(212, 132, 90, 0.2)',
                      color: 'var(--accent-orange)',
                    }}
                  >
                    重置排行榜数据
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
