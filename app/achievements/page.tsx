'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import AchievementBadge from '@/components/AchievementBadge'
import { ACHIEVEMENTS_CONFIG, RARITY_CONFIG, type AchievementRarity } from '@/components/AchievementBadge'
import { useGameStats } from '@/hooks/useGameStats'
import { useCheckInContext } from '@/contexts/CheckInContext'
import { CHECKIN_ACHIEVEMENTS } from '@/hooks/useCheckIn'

// All game achievements combined
const GAME_ACHIEVEMENTS = Object.values(ACHIEVEMENTS_CONFIG)
const CHECKIN_ACHIEVEMENTS_LIST = Object.values(CHECKIN_ACHIEVEMENTS)

type TabType = 'game' | 'checkin'

// Rarity display order
const RARITY_ORDER: AchievementRarity[] = ['legendary', 'epic', 'rare', 'common']

// Achievement type with isUnlocked flag
interface AchievementWithStatus {
  id: string
  name: string
  description: string
  icon: string
  rarity: AchievementRarity
  isUnlocked: boolean
}

// Group achievements by rarity
function groupByRarity(achievements: AchievementWithStatus[]) {
  return RARITY_ORDER.reduce((acc, rarity) => {
    acc[rarity] = achievements.filter(a => a.rarity === rarity)
    return acc
  }, {} as Record<AchievementRarity, AchievementWithStatus[]>)
}

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('game')
  const { stats, unlockedIds } = useGameStats()
  const { checkInData } = useCheckInContext()

  // Game achievements with unlock status
  const gameAchievements = useMemo(() => {
    return GAME_ACHIEVEMENTS.map(a => ({
      ...a,
      isUnlocked: unlockedIds.includes(a.id),
    }))
  }, [unlockedIds])

  // Check-in achievements with unlock status
  const checkinAchievements = useMemo(() => {
    return CHECKIN_ACHIEVEMENTS_LIST.map(a => {
      let isUnlocked = false
      if (a.id === 'first_checkin') isUnlocked = checkInData.totalDays >= 1
      else if (a.id === 'checkin_3') isUnlocked = checkInData.streak >= 3
      else if (a.id === 'checkin_7' || a.id === 'checkin_7_legendary') isUnlocked = checkInData.streak >= 7
      else if (a.id === 'checkin_30') isUnlocked = checkInData.streak >= 30
      return { ...a, isUnlocked }
    })
  }, [checkInData])

  const currentAchievements = activeTab === 'game' ? gameAchievements : checkinAchievements
  const unlockedCount = currentAchievements.filter(a => a.isUnlocked).length
  const totalCount = currentAchievements.length
  const progressPercent = Math.round((unlockedCount / totalCount) * 100)

  const groupedGame = groupByRarity(gameAchievements)
  const groupedCheckin = groupByRarity(checkinAchievements)

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Radial gradient from top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(184,149,110,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(var(--accent-copper) 1px, transparent 1px),
              linear-gradient(90deg, var(--accent-copper) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative">
        {/* Header */}
        <header className="text-center mb-12">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent-copper)] transition-colors mb-8 group"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:-translate-x-0.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回客栈
          </Link>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl font-serif mb-4 text-[var(--accent-copper)]"
            style={{
              fontFamily: 'var(--font-serif), "Noto Serif SC", serif',
              textShadow: '0 0 40px rgba(184,149,110,0.3)',
            }}
          >
            成就殿堂
          </h1>
          <p className="text-[var(--text-secondary)] text-sm tracking-wide">
            记录你在银古客栈的每一步足迹
          </p>

          {/* Progress bar */}
          <div className="mt-8 max-w-sm mx-auto">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[var(--text-muted)]">解锁进度</span>
              <span className="text-[var(--accent-copper)] font-medium">
                {unlockedCount}/{totalCount}
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--bg-elevated)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, var(--accent-copper), var(--accent-amber))',
                  boxShadow: '0 0 12px rgba(184,149,110,0.4)',
                }}
              />
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div
            className="inline-flex p-1 rounded-xl"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setActiveTab('game')}
              className={`
                px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === 'game'
                  ? 'text-[var(--bg-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }
              `}
              style={{
                backgroundColor: activeTab === 'game' ? 'var(--accent-copper)' : 'transparent',
                boxShadow: activeTab === 'game' ? '0 2px 8px rgba(184,149,110,0.3)' : 'none',
              }}
            >
              游戏成就
            </button>
            <button
              onClick={() => setActiveTab('checkin')}
              className={`
                px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === 'checkin'
                  ? 'text-[var(--bg-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }
              `}
              style={{
                backgroundColor: activeTab === 'checkin' ? 'var(--accent-copper)' : 'transparent',
                boxShadow: activeTab === 'checkin' ? '0 2px 8px rgba(184,149,110,0.3)' : 'none',
              }}
            >
              签到成就
            </button>
          </div>
        </div>

        {/* Achievement sections by rarity */}
        <div className="space-y-12">
          {RARITY_ORDER.map(rarity => {
            const achievements = activeTab === 'game'
              ? groupedGame[rarity]
              : groupedCheckin[rarity]

            if (achievements.length === 0) return null

            const unlockedInRarity = achievements.filter(a => a.isUnlocked).length

            return (
              <section key={rarity} className="relative">
                {/* Section header */}
                <div className="flex items-center gap-4 mb-6">
                  {/* Rarity indicator */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: RARITY_CONFIG[rarity].border,
                        boxShadow: `0 0 8px ${RARITY_CONFIG[rarity].glow}`,
                      }}
                    />
                    <h2
                      className="text-sm font-medium uppercase tracking-[0.15em]"
                      style={{ color: RARITY_CONFIG[rarity].border }}
                    >
                      {RARITY_CONFIG[rarity].label}
                    </h2>
                  </div>

                  {/* Count badge */}
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {unlockedInRarity}/{achievements.length}
                  </span>

                  {/* Divider */}
                  <div className="flex-1 h-px" style={{
                    background: `linear-gradient(90deg, ${RARITY_CONFIG[rarity].border}40, transparent)`,
                  }} />
                </div>

                {/* Achievement grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      rarity={rarity}
                      delay={index * 60}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {/* Empty state for unlocked */}
        {unlockedCount === 0 && (
          <div
            className="mt-6 text-center py-16 px-4 rounded-2xl"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px dashed var(--border-subtle)',
            }}
          >
            <div className="text-4xl mb-4 opacity-40">🏆</div>
            <p className="text-[var(--text-muted)]">
              {activeTab === 'game'
                ? '开始玩游戏来解锁成就吧'
                : '完成签到来解锁成就吧'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Individual achievement card component
interface AchievementCardProps {
  achievement: AchievementWithStatus
  rarity: AchievementRarity
  delay: number
}

function AchievementCard({ achievement, rarity, delay }: AchievementCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const config = RARITY_CONFIG[rarity]
  const isUnlocked = achievement.isUnlocked

  return (
    <div
      className={`
        relative p-4 rounded-xl transition-all duration-300
        ${isUnlocked
          ? 'hover:scale-[1.02] hover:-translate-y-0.5'
          : 'opacity-60'
        }
      `}
      style={{
        backgroundColor: isUnlocked ? config.bg : 'var(--bg-elevated)',
        border: `1px ${isUnlocked ? 'solid' : 'dashed'} ${isUnlocked ? config.border : 'var(--border-subtle)'}`,
        boxShadow: isUnlocked
          ? `0 0 20px ${config.glow}, inset 0 0 15px ${config.bg}`
          : 'none',
        animationDelay: `${delay}ms`,
        animation: isUnlocked ? 'fade-in-up 0.4s ease-out forwards' : 'none',
        opacity: isUnlocked ? 1 : 0.7,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover glow effect for unlocked */}
      {isUnlocked && isHovered && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: `0 0 30px ${config.glow}`,
            opacity: 0.5,
          }}
        />
      )}

      <div className="flex items-start gap-4">
        {/* Badge */}
        <div className="relative flex-shrink-0">
          <div
            className={`
              w-14 h-14 rounded-full flex items-center justify-center text-2xl
              transition-all duration-300
              ${isUnlocked ? 'animate-breathe' : 'grayscale'}
            `}
            style={{
              backgroundColor: isUnlocked ? config.bg : 'var(--bg-card)',
              border: `2px solid ${isUnlocked ? config.border : 'var(--text-muted)'}`,
              boxShadow: isUnlocked
                ? `0 0 15px ${config.glow}`
                : 'none',
            }}
          >
            <span style={{ filter: isUnlocked ? 'none' : 'grayscale(100%) opacity(0.5)' }}>
              {achievement.icon}
            </span>
          </div>

          {/* Lock overlay */}
          {!isUnlocked && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(15,15,15,0.4)' }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          )}

          {/* Ping animation for unlocked */}
          {isUnlocked && (
            <div
              className="absolute inset-0 rounded-full animate-ping-glow"
              style={{ boxShadow: `0 0 12px ${config.glow}` }}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className="font-medium text-sm truncate"
              style={{ color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}
            >
              {achievement.name}
            </h3>
          </div>
          <p
            className="text-xs leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {achievement.description}
          </p>

          {/* Rarity badge */}
          <div className="mt-2 flex items-center gap-2">
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: config.bg,
                border: `1px solid ${config.border}`,
                color: config.border,
              }}
            >
              {config.label}
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
}
