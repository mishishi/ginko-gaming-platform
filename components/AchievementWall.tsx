'use client'

import AchievementBadge from './AchievementBadge'
import { ACHIEVEMENTS_CONFIG, RARITY_CONFIG, type AchievementId, type AchievementRarity } from './AchievementBadge'

interface AchievementWallProps {
  unlockedIds: AchievementId[]
}

const STAGGER_CLASSES = [
  'stagger-1',
  'stagger-2',
  'stagger-3',
  'stagger-4',
  'stagger-5',
  'stagger-6',
]

const RARITY_ORDER: AchievementRarity[] = ['legendary', 'epic', 'rare', 'common']

export default function AchievementWall({ unlockedIds }: AchievementWallProps) {
  const achievements = Object.values(ACHIEVEMENTS_CONFIG)
  const unlockedCount = unlockedIds.length
  const totalCount = achievements.length

  // Group achievements by rarity
  const groupedByRarity = RARITY_ORDER.reduce((acc, rarity) => {
    acc[rarity] = achievements.filter(a => a.rarity === rarity)
    return acc
  }, {} as Record<AchievementRarity, typeof achievements>)

  // Count unlocked per rarity
  const unlockedByRarity = RARITY_ORDER.reduce((acc, rarity) => {
    acc[rarity] = groupedByRarity[rarity].filter(a => unlockedIds.includes(a.id)).length
    return acc
  }, {} as Record<AchievementRarity, number>)

  return (
    <div className="w-full" role="region" aria-label="成就墙">
      {/* Header with progress */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>
          成就墙
        </h2>
        <div
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: 'rgba(184, 149, 110, 0.15)',
            border: '1px solid var(--accent-copper)',
            color: 'var(--accent-copper)',
          }}
        >
          已解锁 {unlockedCount}/{totalCount}
        </div>
      </div>

      {/* Achievement groups by rarity */}
      {RARITY_ORDER.map(rarity => (
        <div key={rarity} className="mb-8 last:mb-0">
          {/* Rarity header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: RARITY_CONFIG[rarity].border }}
            />
            <h3
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: RARITY_CONFIG[rarity].border }}
            >
              {RARITY_CONFIG[rarity].label}
            </h3>
            <span
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              {unlockedByRarity[rarity]}/{groupedByRarity[rarity].length}
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: 'var(--border-subtle)' }}
            />
          </div>

          {/* Achievement badges for this rarity */}
          <div
            className="grid gap-6 justify-items-center"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            }}
          >
            {groupedByRarity[rarity].map((achievement, index) => {
              const isUnlocked = unlockedIds.includes(achievement.id)
              const staggerClass = STAGGER_CLASSES[index % STAGGER_CLASSES.length]

              return (
                <div
                  key={achievement.id}
                  className={`animate-fade-in-up opacity-0 ${staggerClass}`}
                >
                  <AchievementBadge
                    achievement={achievement}
                    isUnlocked={isUnlocked}
                    showRarity={false}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
