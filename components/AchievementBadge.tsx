'use client'

import { useState } from 'react'

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

// Rarity colors and effects
export const RARITY_CONFIG: Record<AchievementRarity, {
  border: string
  glow: string
  bg: string
  label: string
}> = {
  common: {
    border: 'var(--text-muted)',
    glow: 'rgba(109, 104, 98, 0.3)',
    bg: 'rgba(109, 104, 98, 0.1)',
    label: '普通',
  },
  rare: {
    border: 'var(--accent-blue)',
    glow: 'rgba(59, 130, 246, 0.4)',
    bg: 'rgba(59, 130, 246, 0.1)',
    label: '稀有',
  },
  epic: {
    border: 'var(--accent-purple)',
    glow: 'rgba(168, 85, 247, 0.4)',
    bg: 'rgba(168, 85, 247, 0.1)',
    label: '史诗',
  },
  legendary: {
    border: 'var(--accent-copper)',
    glow: 'rgba(184, 149, 110, 0.6)',
    bg: 'rgba(184, 149, 110, 0.15)',
    label: '传说',
  },
}

// Achievement data with Chinese names from design spec
export const ACHIEVEMENTS_CONFIG = {
  first_play: {
    id: 'first_play' as const,
    name: '初入客栈',
    description: '首次开始任意游戏',
    icon: '🎴',
    rarity: 'common' as AchievementRarity,
  },
  idol_master: {
    id: 'idol_master' as const,
    name: '偶像达人',
    description: '偶像游戏达到100分',
    icon: '⭐',
    rarity: 'rare' as AchievementRarity,
  },
  quiz_master: {
    id: 'quiz_master' as const,
    name: '知识大师',
    description: '竞技游戏达到100分',
    icon: '🧠',
    rarity: 'rare' as AchievementRarity,
  },
  fate_explorer: {
    id: 'fate_explorer' as const,
    name: '命运探索者',
    description: '命运游戏达到100分',
    icon: '🔮',
    rarity: 'rare' as AchievementRarity,
  },
  all_games: {
    id: 'all_games' as const,
    name: '全能旅人',
    description: '三个游戏都玩过',
    icon: '🏮',
    rarity: 'epic' as AchievementRarity,
  },
  first_score: {
    id: 'first_score' as const,
    name: '初试锋芒',
    description: '任意游戏首次获得分数',
    icon: '📝',
    rarity: 'common' as AchievementRarity,
  },
  perfect_score: {
    id: 'perfect_score' as const,
    name: '完美通关',
    description: '任意游戏达到满分',
    icon: '💯',
    rarity: 'legendary' as AchievementRarity,
  },
  play_10_times: {
    id: 'play_10_times' as const,
    name: '熟能生巧',
    description: '累计游玩10次',
    icon: '🔟',
    rarity: 'common' as AchievementRarity,
  },
  play_50_times: {
    id: 'play_50_times' as const,
    name: '游刃有余',
    description: '累计游玩50次',
    icon: '🎮',
    rarity: 'epic' as AchievementRarity,
  },
  high_scorer: {
    id: 'high_scorer' as const,
    name: '高分得主',
    description: '总分达到500分',
    icon: '🏆',
    rarity: 'rare' as AchievementRarity,
  },
  marathoner: {
    id: 'marathoner' as const,
    name: '马拉松选手',
    description: '累计游玩100次',
    icon: '🏃',
    rarity: 'legendary' as AchievementRarity,
  },
  // 新成就：连续游玩天数
  consecutive_3_days: {
    id: 'consecutive_3_days' as const,
    name: '连续三天',
    description: '连续三天有游戏记录',
    icon: '📆',
    rarity: 'rare' as AchievementRarity,
  },
  consecutive_7_days: {
    id: 'consecutive_7_days' as const,
    name: '连续一周',
    description: '连续七天有游戏记录',
    icon: '🔥',
    rarity: 'epic' as AchievementRarity,
  },
  consecutive_30_days: {
    id: 'consecutive_30_days' as const,
    name: '满月之旅',
    description: '连续三十天有游戏记录',
    icon: '🌕',
    rarity: 'legendary' as AchievementRarity,
  },
  // 新成就：累计游戏时长
  play_10_hours: {
    id: 'play_10_hours' as const,
    name: '沉浸体验',
    description: '累计游戏时长达到10小时',
    icon: '⏰',
    rarity: 'epic' as AchievementRarity,
  },
}

export type AchievementId = keyof typeof ACHIEVEMENTS_CONFIG

export interface Achievement {
  id: AchievementId
  name: string
  description: string
  icon: string
  rarity: AchievementRarity
}

export interface AchievementBadgeProps {
  achievement: Achievement
  isUnlocked: boolean
  showRarity?: boolean
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

export default function AchievementBadge({ achievement, isUnlocked, showRarity = false }: AchievementBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const rarityConfig = RARITY_CONFIG[achievement.rarity]

  return (
    <div className="relative inline-block">
      {/* Badge container */}
      <div
        className={`
          relative w-16 h-16 rounded-full flex items-center justify-center
          transition-all duration-300 cursor-pointer
          ${isUnlocked ? 'animate-unlock-glow' : 'opacity-40 grayscale'}
        `}
        style={{
          backgroundColor: isUnlocked ? rarityConfig.bg : 'rgba(109, 104, 98, 0.1)',
          border: `2px solid ${isUnlocked ? rarityConfig.border : 'var(--text-muted)'}`,
          boxShadow: isUnlocked
            ? `0 0 20px ${rarityConfig.glow}, inset 0 0 15px ${rarityConfig.bg}`
            : 'none',
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        role="button"
        tabIndex={0}
        aria-label={`${achievement.name}: ${achievement.description} - ${isUnlocked ? '已解锁' : '未解锁'}`}
      >
        {/* Icon */}
        <span
          className={`
            text-2xl transition-all duration-300
            ${isUnlocked ? 'animate-breathe' : ''}
          `}
          style={{
            filter: isUnlocked ? 'none' : 'grayscale(100%)',
          }}
        >
          {achievement.icon}
        </span>

        {/* Lock overlay for locked achievements */}
        {!isUnlocked && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(15, 15, 15, 0.5)' }}
          >
            <LockIcon />
          </div>
        )}

        {/* Glow burst animation on unlock */}
        {isUnlocked && (
          <div
            className="absolute inset-0 rounded-full animate-ping-glow"
            style={{ boxShadow: `0 0 15px ${rarityConfig.glow}` }}
          />
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className={`
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            px-3 py-2 rounded-lg shadow-lg
            animate-fade-in z-50
            pointer-events-none
          `}
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            minWidth: '120px',
          }}
        >
          {/* Tooltip arrow */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 -mt-px"
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid var(--border-default)',
            }}
          />

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-0.5">
              <div
                className="text-sm font-medium"
                style={{ color: isUnlocked ? rarityConfig.border : 'var(--text-muted)' }}
              >
                {achievement.name}
              </div>
              {showRarity && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: rarityConfig.bg,
                    border: `1px solid ${rarityConfig.border}`,
                    color: rarityConfig.border,
                  }}
                >
                  {rarityConfig.label}
                </span>
              )}
            </div>
            <div
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              {achievement.description}
            </div>
            <div
              className="text-[10px] mt-1"
              style={{ color: isUnlocked ? 'var(--accent-green)' : 'var(--text-muted)' }}
            >
              {isUnlocked ? '已解锁' : '未解锁'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
