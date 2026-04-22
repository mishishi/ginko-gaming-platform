'use client'

import { useState } from 'react'
import { useCheckInContext } from '@/contexts/CheckInContext'
import { useToast } from '@/contexts/ToastContext'

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function FireIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 23c-3.866 0-7-3.134-7-7 0-3.5 2.5-6.5 5-8.5.5-.5 1-.5 1.5-.5 0 0 0 0 0 0 0 0 .5-2.5 2.5-2 0 0 0 0 0 0 .5 0 1 0 1.5.5C18 8.5 20.5 11 20.5 14c0 2-1.5 3.5-3.5 3.5-1 0-2-.5-2.5-1.5-.5 1-1.5 1.5-2.5 1.5v2c3.866 0 7-3.134 7-7 0-2-1-3.5-2-5 0 3-2 5-2 5s1.5-1.5 1.5-4c0-1-.5-2-1-2.5.5 1 1 2.5 1 4.5 0 2.5-1.5 4-3 5.5-1.5 1.5-2.5 3.5-2.5 5.5 0 1.5.5 3 2 3.5z" />
    </svg>
  )
}

interface CheckInButtonProps {
  variant?: 'default' | 'compact'
  className?: string
}

export default function CheckInButton({ variant = 'default', className = '' }: CheckInButtonProps) {
  const { checkInData, checkIn, isCheckedInToday } = useCheckInContext()
  const { showToast } = useToast()
  const [isAnimating, setIsAnimating] = useState(false)

  const checkedInToday = isCheckedInToday()

  const handleCheckIn = () => {
    if (checkedInToday || isAnimating) return

    setIsAnimating(true)
    const result = checkIn()

    if (result.success) {
      let message = `签到成功！已连续签到 ${result.newStreak} 天`
      if (result.reward) {
        message = `${result.reward.name}！${message}`
        showToast(message, 'success')
      } else {
        showToast(message, 'success')
      }
      setTimeout(() => setIsAnimating(false), 600)
    } else if (result.alreadyCheckedIn) {
      showToast('今日已签到', 'info')
      setIsAnimating(false)
    } else {
      showToast('签到失败，请重试', 'error')
      setIsAnimating(false)
    }
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleCheckIn}
        disabled={checkedInToday}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
          transition-all duration-200 active:scale-95
          ${checkedInToday
            ? 'bg-[var(--accent-copper)]/20 text-[var(--accent-copper)] cursor-default'
            : 'bg-[var(--accent-copper)] text-[var(--bg-primary)] hover:bg-[var(--accent-copper)]/90 cursor-pointer'
          }
          ${isAnimating ? 'animate-pulse-once' : ''}
          ${className}
        `}
        aria-label={checkedInToday ? `今日已签到，连续 ${checkInData.streak} 天` : '点击签到'}
      >
        <CalendarIcon />
        {checkedInToday ? (
          <>
            <span>{checkInData.streak}天</span>
            {checkInData.streak >= 3 && <FireIcon />}
          </>
        ) : (
          <span>签到</span>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleCheckIn}
      disabled={checkedInToday}
      className={`
        flex flex-col items-center gap-2 p-4 rounded-xl min-w-[120px]
        transition-all duration-200 active:scale-95
        ${checkedInToday
          ? 'bg-[var(--accent-copper)]/10 border border-[var(--accent-copper)]/30 cursor-default'
          : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-copper)] cursor-pointer'
        }
        ${isAnimating ? 'animate-pulse-once' : ''}
        ${className}
      `}
      aria-label={checkedInToday ? `今日已签到，连续 ${checkInData.streak} 天` : '点击签到'}
    >
      {/* Calendar icon with check mark overlay if checked in */}
      <div className="relative">
        <CalendarIcon />
        {checkedInToday && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--accent-copper)] rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>

      {/* Status text */}
      <div className="text-center">
        {checkedInToday ? (
          <>
            <div className="text-[var(--accent-copper)] text-sm font-medium">已签到</div>
            <div className="flex items-center justify-center gap-1 text-[var(--text-muted)] text-xs mt-0.5">
              <span>连续</span>
              <span className="text-[var(--accent-copper)] font-medium">{checkInData.streak}</span>
              <span>天</span>
              {checkInData.streak >= 3 && <FireIcon />}
            </div>
          </>
        ) : (
          <div className="text-[var(--text-primary)] text-sm font-medium">签到</div>
        )}
      </div>

      {/* Total days */}
      <div className="text-[var(--text-muted)] text-[10px]">
        累计 {checkInData.totalDays} 天
      </div>

      {/* Streak progress indicator */}
      {!checkedInToday && checkInData.streak > 0 && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[var(--bg-card)] rounded-full text-[10px] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
          再签1天延续 streak
        </div>
      )}
    </button>
  )
}
