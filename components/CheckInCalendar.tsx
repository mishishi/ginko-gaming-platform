'use client'

import { useState, useMemo } from 'react'
import { useCheckInContext } from '@/contexts/CheckInContext'
import { useToast } from '@/contexts/ToastContext'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

interface CheckInCalendarProps {
  className?: string
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function isYesterday(dateStr: string, todayStr: string): boolean {
  const date = new Date(dateStr)
  const today = new Date(todayStr)
  const diffTime = today.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

export default function CheckInCalendar({ className = '' }: CheckInCalendarProps) {
  const { checkInData, checkIn, isCheckedInToday, canMakeUpCheckIn, hasStreakFreeze } = useCheckInContext()
  const { showToast } = useToast()
  const [isAnimating, setIsAnimating] = useState(false)
  const [justCheckedIn, setJustCheckedIn] = useState(false)

  const today = new Date()
  const todayStr = getDateString(today)

  // Build calendar data for current month
  const calendarData = useMemo(() => {
    const year = today.getFullYear()
    const month = today.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startWeekday = firstDay.getDay()

    // Get checked-in dates from this month
    const checkedInDates = new Set<string>()
    if (checkInData.lastCheckIn) {
      // We only store lastCheckIn, so we show today if checked in
      if (checkInData.lastCheckIn === todayStr) {
        checkedInDates.add(todayStr)
      }
    }

    return { year, month, daysInMonth, startWeekday, checkedInDates }
  }, [todayStr, checkInData.lastCheckIn])

  const handleCheckIn = () => {
    if (isAnimating) return

    setIsAnimating(true)
    const result = checkIn()

    if (result.success) {
      setJustCheckedIn(true)
      let message = `签到成功！已连续签到 ${result.newStreak} 天`
      if (result.reward) {
        message = `${result.reward.icon} ${result.reward.name}！${message}`
        showToast(message, 'success')
      } else {
        showToast(message, 'success')
      }
      setTimeout(() => {
        setIsAnimating(false)
        setJustCheckedIn(false)
      }, 800)
    } else if (result.alreadyCheckedIn) {
      showToast('今日已签到', 'info')
      setIsAnimating(false)
    } else {
      showToast('签到失败，请重试', 'error')
      setIsAnimating(false)
    }
  }

  const checkedInToday = isCheckedInToday()

  // Generate calendar grid
  const days = []
  // Empty cells before first day
  for (let i = 0; i < calendarData.startWeekday; i++) {
    days.push(<div key={`empty-${i}`} className="w-10 h-10" />)
  }
  // Day cells
  for (let day = 1; day <= calendarData.daysInMonth; day++) {
    const dateStr = `${calendarData.year}-${String(calendarData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isToday = dateStr === todayStr
    const isCheckedIn = dateStr === todayStr && checkedInToday
    const isFuture = dateStr > todayStr

    days.push(
      <div
        key={day}
        className={`
          w-10 h-10 flex items-center justify-center relative
          text-sm font-medium rounded-lg transition-all duration-300
          ${isToday ? 'ring-1 ring-[var(--accent-copper)]/50' : ''}
          ${isFuture ? 'opacity-30' : ''}
        `}
        style={{
          color: isCheckedIn
            ? 'var(--accent-copper)'
            : isToday
              ? 'var(--text-primary)'
              : 'var(--text-muted)',
        }}
      >
        {day}
        {/* Check-in stamp */}
        {isCheckedIn && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`
                text-[10px] font-bold rotate-[-8deg]
                ${justCheckedIn ? 'animate-stamp' : ''}
              `}
              style={{
                color: 'var(--accent-copper)',
                textShadow: '0 0 8px rgba(184, 149, 110, 0.5)',
              }}
            >
              ✓
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`p-5 rounded-xl ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(184, 149, 110, 0.15)' }}
          >
            <span className="text-lg">📅</span>
          </div>
          <div>
            <h3 className="text-base font-serif" style={{ color: 'var(--text-primary)' }}>
              每日签到
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {calendarData.year}年 {calendarData.month + 1}月
            </p>
          </div>
        </div>

        {/* Check-in button */}
        <button
          onClick={handleCheckIn}
          disabled={checkedInToday || isAnimating}
          className={`
            relative px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-300 overflow-hidden
            ${checkedInToday
              ? 'cursor-default'
              : 'hover:scale-105 active:scale-95'
            }
            ${isAnimating ? 'animate-pulse' : ''}
          `}
          style={{
            backgroundColor: checkedInToday
              ? 'rgba(184, 149, 110, 0.2)'
              : 'var(--accent-copper)',
            color: checkedInToday
              ? 'var(--accent-copper)'
              : 'var(--bg-primary)',
          }}
        >
          {checkedInToday ? (
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              已签到
            </span>
          ) : (
            '签到'
          )}
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className="w-10 h-6 flex items-center justify-center text-[10px] font-medium"
            style={{
              color: i === 0 || i === 6
                ? 'var(--accent-copper)'
                : 'var(--text-muted)',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-4">
          {/* Streak */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm" role="img" aria-hidden="true">🔥</span>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>连续</div>
              <div className="text-sm font-medium" style={{ color: 'var(--accent-copper)' }}>
                {checkInData.streak} 天
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm" role="img" aria-hidden="true">📊</span>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>累计</div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {checkInData.totalDays} 天
              </div>
            </div>
          </div>

          {/* Streak Freeze */}
          {checkInData.streakFreeze > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm" role="img" aria-hidden="true">❄️</span>
              <div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>补签卡</div>
                <div className="text-sm font-medium" style={{ color: 'var(--accent-copper)' }}>
                  ×{checkInData.streakFreeze}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Make-up reminder */}
        {canMakeUpCheckIn() && (
          <div
            className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full animate-pulse"
            style={{
              backgroundColor: 'rgba(184, 149, 110, 0.15)',
              color: 'var(--accent-copper)',
            }}
          >
            <span>⏰</span>
            <span>今日可补签</span>
          </div>
        )}
        {/* Streak motivation */}
        {!checkedInToday && !canMakeUpCheckIn() && checkInData.streak > 0 && (
          <div
            className="text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: 'rgba(184, 149, 110, 0.1)',
              color: 'var(--accent-copper)',
            }}
          >
            再签1天延续 streak
          </div>
        )}
        {checkedInToday && checkInData.streak >= 3 && (
          <div
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: 'rgba(184, 149, 110, 0.15)',
              color: 'var(--accent-copper)',
            }}
          >
            <span>🔥</span>
            <span>streak火力全开</span>
          </div>
        )}
      </div>

      {/* Make-up info banner */}
      {canMakeUpCheckIn() && (
        <div
          className="mt-4 p-3 rounded-lg text-xs"
          style={{
            backgroundColor: 'rgba(184, 149, 110, 0.08)',
            border: '1px solid rgba(184, 149, 110, 0.2)',
            color: 'var(--text-secondary)',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span>💡</span>
            <span className="font-medium" style={{ color: 'var(--accent-copper)' }}>补签机会</span>
          </div>
          <p>昨天错过了签到？今日补签可以保留你的连续 streak（但不会增加天数）</p>
        </div>
      )}
      {/* Streak freeze info */}
      {!checkedInToday && checkInData.streakFreeze > 0 && (
        <div
          className="mt-3 p-3 rounded-lg text-xs"
          style={{
            backgroundColor: 'rgba(100, 180, 255, 0.08)',
            border: '1px solid rgba(100, 180, 255, 0.2)',
            color: 'var(--text-secondary)',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span>❄️</span>
            <span className="font-medium" style={{ color: 'var(--accent-cyan)' }}>补签卡保护</span>
          </div>
          <p>如果明天也忘记签到，补签卡将自动启用，保护你的 streak</p>
        </div>
      )}

      {/* Stamp animation keyframes */}
      <style jsx>{`
        @keyframes stamp {
          0% {
            transform: scale(3) rotate(-20deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(-8deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(-8deg);
            opacity: 1;
          }
        }
        .animate-stamp {
          animation: stamp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  )
}
