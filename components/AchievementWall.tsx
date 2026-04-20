'use client'

import AchievementBadge from './AchievementBadge'
import { ACHIEVEMENTS_CONFIG, type AchievementId } from './AchievementBadge'

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

export default function AchievementWall({ unlockedIds }: AchievementWallProps) {
  const achievements = Object.values(ACHIEVEMENTS_CONFIG)
  const unlockedCount = unlockedIds.length
  const totalCount = achievements.length

  return (
    <div className="w-full">
      {/* Header with progress */}
      <div className="flex items-center justify-between mb-6">
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

      {/* Achievement grid */}
      <div
        className="grid gap-6 justify-items-center"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        }}
      >
        {achievements.map((achievement, index) => {
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
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
