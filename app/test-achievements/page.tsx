'use client'

import { useState, useEffect } from 'react'
import { ACHIEVEMENTS_CONFIG, RARITY_CONFIG, type AchievementId, type AchievementRarity } from '@/components/AchievementBadge'
import AchievementBadge from '@/components/AchievementBadge'

const STATS_KEY = 'yinqiu-stats'

interface GameStats {
  playCount: Record<string, number>
  highScore: Record<string, number>
  lastPlayedAt: Record<string, string>
  achievements: string[]
}

export default function TestAchievementsPage() {
  const [unlockedIds, setUnlockedIds] = useState<AchievementId[]>([])
  const [stats, setStats] = useState<GameStats | null>(null)

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
      </div>
    </div>
  )
}
