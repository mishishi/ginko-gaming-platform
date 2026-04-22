'use client'

import { useState, useRef, useEffect } from 'react'
import { useUserContext } from '@/contexts/UserContext'
import { useCheckInContext } from '@/contexts/CheckInContext'
import { useGameStats } from '@/hooks/useGameStats'
import { ACHIEVEMENTS_CONFIG } from '@/components/AchievementBadge'

interface UserProfileCardProps {
  onClose?: () => void
}

const TOTAL_ACHIEVEMENTS = Object.keys(ACHIEVEMENTS_CONFIG).length

export default function UserProfileCard({ onClose }: UserProfileCardProps) {
  const { userData, displayName, updateNickname } = useUserContext()
  const { checkInData } = useCheckInContext()
  const { stats } = useGameStats()
  const [isEditing, setIsEditing] = useState(false)
  const [nicknameInput, setNicknameInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const unlockedCount = stats.achievements.length

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSaveNickname = () => {
    const trimmed = nicknameInput.trim()
    if (trimmed.length > 0 && trimmed.length <= 12) {
      updateNickname(trimmed)
    } else if (trimmed.length === 0) {
      updateNickname(null)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveNickname()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setNicknameInput('')
    }
  }

  const formatPlayTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}分钟`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}小时${mins}分` : `${hours}小时`
  }

  return (
    <div
      className="w-72 rounded-xl p-5"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
      role="dialog"
      aria-label="用户档案"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-serif"
            style={{
              backgroundColor: 'var(--accent-copper)',
              color: 'var(--bg-primary)',
            }}
          >
            🏮
          </div>
          <div>
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveNickname}
                maxLength={12}
                placeholder="输入昵称"
                className="w-28 px-2 py-1 text-sm rounded border bg-[var(--bg-card)] border-[var(--accent-copper)] text-[var(--text-primary)] focus:outline-none"
              />
            ) : (
              <button
                onClick={() => {
                  setNicknameInput(userData.nickname || '')
                  setIsEditing(true)
                }}
                className="text-sm font-medium hover:text-[var(--accent-copper)] transition-colors text-left"
                style={{ color: 'var(--text-primary)' }}
              >
                {displayName}
                <span className="text-[10px] ml-1 opacity-50">✏️</span>
              </button>
            )}
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              ID: {userData.anonymousId}
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--bg-card)] transition-colors"
            aria-label="关闭"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatItem
          icon="🔥"
          label="连续签到"
          value={`${checkInData.streak}天`}
          highlight={checkInData.streak >= 7}
        />
        <StatItem
          icon="📅"
          label="累计签到"
          value={`${checkInData.totalDays}天`}
        />
        <StatItem
          icon="🎮"
          label="玩过游戏"
          value={`${userData.gamesPlayed.length}款`}
        />
        <StatItem
          icon="🏆"
          label="成就解锁"
          value={`${unlockedCount}/${TOTAL_ACHIEVEMENTS}`}
          highlight={unlockedCount > 0}
        />
      </div>

      {/* Play Time */}
      <div className="pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: 'var(--text-muted)' }}>游戏时长</span>
          <span style={{ color: 'var(--text-secondary)' }}>{formatPlayTime(userData.totalPlayTime)}</span>
        </div>
      </div>
    </div>
  )
}

function StatItem({ icon, label, value, highlight = false }: {
  icon: string
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className="p-3 rounded-lg"
      style={{
        backgroundColor: highlight ? 'rgba(184, 149, 110, 0.15)' : 'var(--bg-card)',
        border: highlight ? '1px solid rgba(184, 149, 110, 0.3)' : '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span role="img" aria-hidden="true">{icon}</span>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <div
        className="text-sm font-medium"
        style={{ color: highlight ? 'var(--accent-copper)' : 'var(--text-primary)' }}
      >
        {value}
      </div>
    </div>
  )
}
