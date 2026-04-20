'use client'

import { useState } from 'react'

// Achievement data with Chinese names from design spec
export const ACHIEVEMENTS_CONFIG = {
  first_play: {
    id: 'first_play' as const,
    name: '初入客栈',
    description: '首次开始任意游戏',
    icon: '🎴',
  },
  idol_master: {
    id: 'idol_master' as const,
    name: '偶像达人',
    description: '偶像游戏达到100分',
    icon: '⭐',
  },
  quiz_master: {
    id: 'quiz_master' as const,
    name: '知识大师',
    description: '竞技游戏达到100分',
    icon: '🧠',
  },
  fate_explorer: {
    id: 'fate_explorer' as const,
    name: '命运探索者',
    description: '命运游戏达到100分',
    icon: '🔮',
  },
  all_games: {
    id: 'all_games' as const,
    name: '全能旅人',
    description: '三个游戏都玩过',
    icon: '🏮',
  },
}

export type AchievementId = keyof typeof ACHIEVEMENTS_CONFIG

export interface Achievement {
  id: AchievementId
  name: string
  description: string
  icon: string
}

export interface AchievementBadgeProps {
  achievement: Achievement
  isUnlocked: boolean
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

export default function AchievementBadge({ achievement, isUnlocked }: AchievementBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative inline-block">
      {/* Badge container */}
      <div
        className={`
          relative w-16 h-16 rounded-full flex items-center justify-center
          transition-all duration-300 cursor-pointer
          ${isUnlocked
            ? 'animate-unlock-glow'
            : 'opacity-40 grayscale'
          }
        `}
        style={{
          backgroundColor: isUnlocked ? 'rgba(184, 149, 110, 0.15)' : 'rgba(109, 104, 98, 0.1)',
          border: `2px solid ${isUnlocked ? 'var(--accent-copper)' : 'var(--text-muted)'}`,
          boxShadow: isUnlocked
            ? '0 0 20px rgba(184, 149, 110, 0.4), inset 0 0 15px rgba(184, 149, 110, 0.1)'
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
          <div className="absolute inset-0 rounded-full animate-ping-glow" />
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
            <div
              className="text-sm font-medium mb-0.5"
              style={{ color: isUnlocked ? 'var(--accent-copper)' : 'var(--text-muted)' }}
            >
              {achievement.name}
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

      <style jsx>{`
        @keyframes ping-glow {
          0% {
            box-shadow: 0 0 0 0 rgba(184, 149, 110, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(184, 149, 110, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(184, 149, 110, 0);
          }
        }

        @keyframes unlock-glow {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-ping-glow {
          animation: ping-glow 1.5s ease-out infinite;
        }

        .animate-unlock-glow {
          animation: unlock-glow 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
