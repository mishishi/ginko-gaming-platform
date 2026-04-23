'use client'

import { useState, useEffect } from 'react'
import { useUserContext } from '@/contexts/UserContext'
import { useCheckInContext } from '@/contexts/CheckInContext'
import { useGameStats } from '@/hooks/useGameStats'
import { ACHIEVEMENTS_CONFIG, RARITY_CONFIG, type AchievementRarity } from '@/components/AchievementBadge'
import AchievementBadge from '@/components/AchievementBadge'
import StatsSummary from '@/components/StatsSummary'
import LevelUpModal from '@/components/LevelUpModal'
import TitleUnlockModal from '@/components/TitleUnlockModal'
import Link from 'next/link'

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500]
const LEVEL_NAMES = ['新晋旅人', '客栈常客', '银古居士', '迷雾行者', '命运探索者', '客栈传奇']

function getLevelInfo(exp: number): { level: number; title: string; currentExp: number; nextExp: number; progress: number } {
  let level = 1
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (exp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1
      break
    }
  }
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const currentExp = exp - currentThreshold
  const neededExp = nextThreshold - currentThreshold
  const progress = neededExp > 0 ? (currentExp / neededExp) * 100 : 100

  return {
    level,
    title: LEVEL_NAMES[level - 1] || LEVEL_NAMES[LEVEL_NAMES.length - 1],
    currentExp,
    nextExp: neededExp,
    progress,
  }
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}秒`
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return secs > 0 ? `${mins}分${secs}秒` : `${mins}分钟`
  }
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
}

export default function UserPage() {
  const { userData, isLoaded, isLoggedIn, cloudUser, displayName, login, register, migrateData, syncToCloud, isSyncing, exportData, deleteAccount, levelUpTo, newTitle, clearAnimations, updateNicknameCloud } = useUserContext()
  const { checkInData } = useCheckInContext()
  const { stats } = useGameStats()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [nicknameInput, setNicknameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [nicknameEditValue, setNicknameEditValue] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const levelInfo = isLoggedIn && cloudUser
    ? getLevelInfo(cloudUser.exp)
    : getLevelInfo(0)

  const unlockedAchievements = stats.achievements
  const totalAchievements = Object.keys(ACHIEVEMENTS_CONFIG).length

  const handleLogin = async () => {
    const trimmed = nicknameInput.trim()
    if (!trimmed) return
    setIsLoggingIn(true)
    const result = await login(trimmed, passwordInput)
    setIsLoggingIn(false)
    setNicknameInput('')
    setPasswordInput('')
    if (result.success) {
      // Auto-sync local data to cloud after login
      await syncToCloud(stats, {
        consecutiveDays: checkInData.streak,
        lastCheckIn: checkInData.lastCheckIn || '',
        totalCheckIns: checkInData.totalDays,
        streakFreeze: checkInData.streakFreeze,
      })
    }
  }

  const handleRegister = async () => {
    const nickname = nicknameInput.trim() || undefined
    setIsLoggingIn(true)
    const result = await register(nickname, passwordInput)
    setIsLoggingIn(false)
    setNicknameInput('')
    setPasswordInput('')
    if (result.success) {
      // Auto-sync local data to cloud after registration
      await syncToCloud(stats, {
        consecutiveDays: checkInData.streak,
        lastCheckIn: checkInData.lastCheckIn || '',
        totalCheckIns: checkInData.totalDays,
        streakFreeze: checkInData.streakFreeze,
      })
    }
  }

  const handleMigrate = async () => {
    await migrateData(stats, {
      consecutiveDays: checkInData.streak,
      lastCheckIn: checkInData.lastCheckIn || '',
      totalCheckIns: checkInData.totalDays,
      streakFreeze: checkInData.streakFreeze,
    })
  }

  const handleExportData = async () => {
    await exportData()
  }

  const handleDeleteAccount = async () => {
    await deleteAccount()
    setShowDeleteConfirm(false)
  }

  const handleEditNickname = () => {
    setNicknameEditValue(cloudUser?.nickname || displayName)
    setIsEditingNickname(true)
  }

  const handleSaveNickname = async () => {
    const trimmed = nicknameEditValue.trim()
    if (!trimmed) return
    await updateNicknameCloud(trimmed)
    setIsEditingNickname(false)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-[var(--text-muted)]">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header Card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(184, 149, 110, 0.15) 0%, rgba(74, 92, 79, 0.15) 100%)',
            border: '1px solid rgba(184, 149, 110, 0.3)',
          }}
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
              style={{
                backgroundColor: 'var(--accent-copper)',
                color: 'var(--bg-primary)',
                boxShadow: '0 0 30px rgba(184, 149, 110, 0.4)',
              }}
            >
              🏮
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                {isEditingNickname ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nicknameEditValue}
                      onChange={(e) => setNicknameEditValue(e.target.value.slice(0, 12))}
                      maxLength={12}
                      className="px-3 py-1 rounded-lg text-lg"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--accent-copper)',
                        color: 'var(--text-primary)',
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveNickname()}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveNickname}
                      className="px-3 py-1 rounded-lg text-sm"
                      style={{
                        backgroundColor: 'var(--accent-copper)',
                        color: 'var(--bg-primary)',
                      }}
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setIsEditingNickname(false)}
                      className="px-3 py-1 rounded-lg text-sm"
                      style={{
                        backgroundColor: 'rgba(109, 104, 98, 0.2)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-serif" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                      {displayName}
                    </h1>
                    {isLoggedIn && (
                      <>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{
                            backgroundColor: 'rgba(74, 92, 79, 0.3)',
                            color: 'var(--accent-green)',
                          }}
                        >
                          已登录
                        </span>
                        <button
                          onClick={handleEditNickname}
                          className="text-xs px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: 'rgba(184, 149, 110, 0.1)',
                            border: '1px solid var(--accent-copper)',
                            color: 'var(--accent-copper)',
                          }}
                        >
                          修改昵称
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                ID: {userData.anonymousId}
              </div>

              {/* Title & Level */}
              <div className="flex items-center gap-4">
                <div
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    backgroundColor: 'rgba(184, 149, 110, 0.2)',
                    border: '1px solid var(--accent-copper)',
                    color: 'var(--accent-copper)',
                  }}
                >
                  {isLoggedIn && cloudUser ? cloudUser.title : levelInfo.title}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Lv.{isLoggedIn && cloudUser ? cloudUser.level : levelInfo.level}
                  </span>
                  {isLoggedIn && cloudUser && (
                    <div className="w-32 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${levelInfo.progress}%`,
                          backgroundColor: 'var(--accent-copper)',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Exp for logged in users */}
              {isLoggedIn && cloudUser && (
                <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {levelInfo.currentExp} / {levelInfo.nextExp} EXP
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Login/Register Section for non-logged-in users */}
        {!isLoggedIn && (
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              登录云端，数据永续
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              登录后将您的游戏数据同步到云端，换设备也不会丢失。还可以获得经验值和称号升级！
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="输入昵称（最多12字符）"
                maxLength={12}
                className="w-full px-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="密码（可选，有密码更安全）"
                className="w-full px-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleLogin}
                  disabled={isLoggingIn || !nicknameInput.trim()}
                  className="flex-1 px-6 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--accent-copper)', color: 'var(--bg-primary)' }}
                >
                  {isLoggingIn ? '登录中...' : '登录'}
                </button>
                <button
                  onClick={handleRegister}
                  disabled={isLoggingIn}
                  className="flex-1 px-6 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    backgroundColor: 'rgba(74, 92, 79, 0.2)',
                    border: '1px solid var(--accent-green)',
                    color: 'var(--accent-green)',
                  }}
                >
                  {isLoggingIn ? '注册中...' : '注册'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Migration prompt for unregistered users with data */}
        {!isLoggedIn && !userData.isRegistered && stats.achievements.length > 0 && (
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: 'rgba(184, 149, 110, 0.1)',
              border: '1px solid rgba(184, 149, 110, 0.3)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium mb-1" style={{ color: 'var(--accent-copper)' }}>
                  📤 迁移本地数据
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  检测到您有 {stats.achievements.length} 个成就和游戏记录，登录即可迁移到云端
                </p>
              </div>
              <button
                onClick={handleMigrate}
                className="px-6 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                style={{
                  backgroundColor: 'var(--accent-copper)',
                  color: 'var(--bg-primary)',
                }}
              >
                迁移数据
              </button>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <StatsSummary stats={stats} />

        {/* Achievements Preview */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
              🏆 成就进度
            </h2>
            <Link
              href="/achievements"
              className="text-sm transition-colors hover:text-[var(--accent-copper)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              查看全部 →
            </Link>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {Object.values(ACHIEVEMENTS_CONFIG).slice(0, 8).map((achievement) => {
              const isUnlocked = stats.achievements.includes(achievement.id)
              return (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={isUnlocked}
                  showRarity={false}
                />
              )
            })}
          </div>

          <div className="mt-4 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            已解锁 {unlockedAchievements.length} / {totalAchievements} 个成就
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/checkin"
            className="p-4 rounded-xl text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="text-2xl mb-1">📅</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>签到日历</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              连续 {checkInData.streak} 天
            </div>
          </Link>

          <Link
            href="/achievements"
            className="p-4 rounded-xl text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="text-2xl mb-1">🏅</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>成就</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {unlockedAchievements.length} 已解锁
            </div>
          </Link>

          <Link
            href="/leaderboard"
            className="p-4 rounded-xl text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>排行榜</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>查看排名</div>
          </Link>

          <div
            className="p-4 rounded-xl text-center"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="text-2xl mb-1">⏱️</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>游戏时长</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {formatDuration(Object.values(stats.totalPlayTime || {}).reduce((a, b) => a + b, 0))}
            </div>
          </div>
        </div>

        {/* Account Actions */}
        {isLoggedIn && (
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              账户设置
            </h2>
            <div className="space-y-4">
              {/* Export Data */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    导出您的所有数据
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    下载 JSON 格式的完整数据备份
                  </div>
                </div>
                <button
                  onClick={handleExportData}
                  disabled={isSyncing}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    backgroundColor: 'rgba(184, 149, 110, 0.2)',
                    border: '1px solid rgba(184, 149, 110, 0.4)',
                    color: 'var(--accent-copper)',
                  }}
                >
                  导出数据
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    注销账户将删除所有云端数据
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    您的排行榜记录将被保留
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                  }}
                >
                  注销账户
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div
              className="rounded-2xl p-6 max-w-sm mx-4 text-center"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-3xl mb-4">⚠️</div>
              <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                确定要注销账户吗？
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                此操作不可恢复。所有云端数据将被永久删除，但您的排行榜记录将被保留。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                  style={{
                    backgroundColor: 'rgba(109, 104, 98, 0.2)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  取消
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                    color: '#ef4444',
                  }}
                >
                  确认注销
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Level Up Modal */}
        {levelUpTo && (
          <LevelUpModal
            level={levelUpTo}
            onClose={clearAnimations}
          />
        )}

        {/* Title Unlock Modal */}
        {newTitle && (
          <TitleUnlockModal
            title={newTitle}
            onClose={clearAnimations}
          />
        )}
      </div>
    </div>
  )
}
