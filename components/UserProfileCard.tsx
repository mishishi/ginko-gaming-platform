'use client'

import { useState, useRef, useEffect } from 'react'
import { useUserContext } from '@/contexts/UserContext'
import { useCheckInContext } from '@/contexts/CheckInContext'
import { useGameStats } from '@/hooks/useGameStats'
import { ACHIEVEMENTS_CONFIG } from '@/components/AchievementBadge'
import { useToast } from '@/contexts/ToastContext'

interface UserProfileCardProps {
  onClose?: () => void
}

const TOTAL_ACHIEVEMENTS = Object.keys(ACHIEVEMENTS_CONFIG).length

export default function UserProfileCard({ onClose }: UserProfileCardProps) {
  const {
    userData,
    displayName,
    isLoggedIn,
    cloudUser,
    isSyncing,
    lastSyncAt,
    updateNickname,
    login,
    register,
    logout,
    migrateData,
    syncToCloud,
  } = useUserContext()
  const { checkInData } = useCheckInContext()
  const { stats } = useGameStats()
  const { showToast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [nicknameInput, setNicknameInput] = useState('')
  const [loginInput, setLoginInput] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)
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

  const handleLogin = async () => {
    const trimmed = loginInput.trim()
    if (trimmed.length === 0) {
      showToast('请输入昵称', 'error')
      return
    }
    if (trimmed.length > 12) {
      showToast('昵称最多12个字符', 'error')
      return
    }

    setIsLoggingIn(true)
    const result = await login(trimmed)
    setIsLoggingIn(false)

    if (result.success) {
      showToast('登录成功', 'success')
      setLoginInput('')
      // Auto-sync local data to cloud after login
      await syncToCloud(stats, {
        consecutiveDays: checkInData.streak,
        lastCheckIn: checkInData.lastCheckIn || '',
        totalCheckIns: checkInData.totalDays,
      })
    } else {
      showToast(result.error || '登录失败', 'error')
    }
  }

  const handleRegister = async () => {
    const nickname = loginInput.trim() || undefined
    setIsLoggingIn(true)
    const result = await register(nickname)
    setIsLoggingIn(false)

    if (result.success) {
      showToast('注册成功', 'success')
      setLoginInput('')
      // Auto-sync local data to cloud after registration
      await syncToCloud(stats, {
        consecutiveDays: checkInData.streak,
        lastCheckIn: checkInData.lastCheckIn || '',
        totalCheckIns: checkInData.totalDays,
      })
    } else {
      showToast(result.error || '注册失败', 'error')
    }
  }

  const handleMigrate = async () => {
    setIsMigrating(true)
    try {
      const result = await migrateData(stats, {
        consecutiveDays: checkInData.streak,
        lastCheckIn: checkInData.lastCheckIn || '',
        totalCheckIns: checkInData.totalDays,
      })

      if (result.success) {
        if (result.expGained && result.expGained > 0) {
          showToast(`数据已迁移，获得 ${result.expGained} 经验值`, 'success')
        } else {
          showToast('数据已同步到云端', 'success')
        }
      } else {
        showToast(result.error || '迁移失败', 'error')
      }
    } finally {
      setIsMigrating(false)
    }
  }

  const handleSync = async () => {
    const result = await syncToCloud(stats, {
      consecutiveDays: checkInData.streak,
      lastCheckIn: checkInData.lastCheckIn || '',
      totalCheckIns: checkInData.totalDays,
    })

    if (result.success) {
      showToast('数据已同步', 'success')
    } else {
      showToast(result.error || '同步失败', 'error')
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
      className="w-80 rounded-xl p-5"
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
            {isLoggedIn && cloudUser && (
              <div className="text-[10px] px-1.5 py-0.5 rounded mt-0.5 inline-block" style={{ backgroundColor: 'rgba(74, 92, 79, 0.3)', color: 'var(--accent-green)' }}>
                Lv.{cloudUser.level} · {cloudUser.title}
              </div>
            )}
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

      {/* Cloud Status */}
      {!isLoggedIn ? (
        <div
          className="mb-4 p-3 rounded-lg"
          style={{
            backgroundColor: 'rgba(184, 149, 110, 0.1)',
            border: '1px solid rgba(184, 149, 110, 0.3)',
          }}
        >
          <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            登录后将数据同步到云端，换设备也不丢失
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              placeholder="输入昵称"
              maxLength={12}
              className="flex-1 px-2 py-1.5 text-xs rounded border bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-copper)]"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="px-3 py-1.5 text-xs rounded font-medium transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent-copper)', color: 'var(--bg-primary)' }}
            >
              {isLoggingIn ? '...' : '登录'}
            </button>
            <button
              onClick={handleRegister}
              disabled={isLoggingIn}
              className="px-3 py-1.5 text-xs rounded font-medium transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'rgba(74, 92, 79, 0.3)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)' }}
            >
              {isLoggingIn ? '...' : '注册'}
            </button>
          </div>
        </div>
      ) : (
        <div
          className="mb-4 p-3 rounded-lg"
          style={{
            backgroundColor: 'rgba(74, 92, 79, 0.2)',
            border: '1px solid rgba(74, 92, 79, 0.3)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs" style={{ color: 'var(--accent-green)' }}>
              ✓ 已登录云端
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="px-2 py-1 text-[10px] rounded transition-all hover:opacity-80 disabled:opacity-50"
                style={{ backgroundColor: 'rgba(74, 92, 79, 0.3)', color: 'var(--text-secondary)' }}
              >
                {isSyncing ? '同步中...' : '同步'}
              </button>
              <button
                onClick={logout}
                className="px-2 py-1 text-[10px] rounded transition-all hover:opacity-80"
                style={{ backgroundColor: 'rgba(212, 90, 90, 0.2)', color: 'var(--accent-red)' }}
              >
                退出
              </button>
            </div>
          </div>
          {lastSyncAt && (
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              上次同步: {new Date(lastSyncAt).toLocaleString('zh-CN')}
            </div>
          )}
        </div>
      )}

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

      {/* Migrate Button for unregistered users */}
      {!userData.isRegistered && unlockedCount > 0 && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            onClick={handleMigrate}
            disabled={isMigrating}
            className="w-full py-2 text-xs rounded font-medium transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: 'rgba(184, 149, 110, 0.2)',
              border: '1px solid var(--accent-copper)',
              color: 'var(--accent-copper)',
            }}
          >
            {isMigrating ? '迁移中...' : '📤 迁移数据到云端'}
          </button>
        </div>
      )}
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
