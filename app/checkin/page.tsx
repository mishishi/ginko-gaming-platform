'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useCheckInContext } from '@/contexts/CheckInContext'
import { useUserContext } from '@/contexts/UserContext'
import { useGameStats } from '@/hooks/useGameStats'
import { useToast } from '@/contexts/ToastContext'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export default function CheckInCalendarPage() {
  const { checkInData, checkIn, isCheckedInToday } = useCheckInContext()
  const { isLoggedIn, syncToCloud } = useUserContext()
  const { stats } = useGameStats()
  const { showToast } = useToast()
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const checkedInToday = isCheckedInToday()

  const getDateString = (date: Date) => date.toISOString().split('T')[0]
  const todayStr = mounted ? getDateString(new Date()) : ''

  const handleCheckIn = async () => {
    if (checkedInToday) {
      showToast(`今日已签到 ${checkInData.streak}天连续 🔥`, 'info')
      return
    }
    const result = checkIn()
    if (result.success) {
      let msg = ''
      if (result.isMakeUp) {
        msg = `补签成功！连续${result.newStreak}天`
      } else {
        msg = `签到成功！连续${result.newStreak}天 +${result.expGained} EXP`
      }
      if (result.milestonesReached.length > 0) {
        const parts = result.milestonesReached.map(m => `${m.label}+${m.exp}EXP`)
        msg += ' | ' + parts.join(' ')
      }
      if (result.reward) {
        msg = `${result.reward.icon} ${result.reward.name}！${msg}`
      }
      showToast(msg, 'success')

      // Sync to cloud if logged in
      if (isLoggedIn) {
        await syncToCloud(stats, {
          consecutiveDays: result.newStreak,
          lastCheckIn: new Date().toISOString().split('T')[0],
          totalCheckIns: checkInData.totalDays + 1,
          streakFreeze: checkInData.streakFreeze,
        })
      }
    }
  }

  const navigateMonth = (delta: number) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + delta)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()
    const totalDays = lastDay.getDate()

    const days: Array<{ date: number | null; dateStr: string | null; isCurrentMonth: boolean }> = []

    for (let i = 0; i < startPadding; i++) {
      days.push({ date: null, dateStr: null, isCurrentMonth: false })
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d)
      const dateStr = dateObj.toISOString().split('T')[0]
      days.push({ date: d, dateStr, isCurrentMonth: true })
    }

    return days
  }, [year, month])

  const checkInSet = useMemo(() => {
    const set = new Set<string>()
    for (const entry of checkInData.checkInHistory) {
      set.add(entry.date)
    }
    return set
  }, [checkInData.checkInHistory])

  const isMakeUpSet = useMemo(() => {
    const set = new Set<string>()
    for (const entry of checkInData.checkInHistory) {
      if (entry.isMakeUp) set.add(entry.date)
    }
    return set
  }, [checkInData.checkInHistory])

  const monthName = currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
  const isCurrentMonth = mounted && year === new Date().getFullYear() && month === new Date().getMonth()

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(184,149,110,0.1) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(var(--accent-copper) 1px, transparent 1px),
              linear-gradient(90deg, var(--accent-copper) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 relative">
        <header className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent-copper)] transition-colors mb-6 group"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回客栈
          </Link>

          <h1 className="text-3xl md:text-4xl font-serif mb-3 text-[var(--accent-copper)]" style={{ fontFamily: 'var(--font-serif), "Noto Serif SC", serif', textShadow: '0 0 40px rgba(184,149,110,0.3)' }}>
            签到日历
          </h1>
          <p className="text-[var(--text-secondary)] text-sm tracking-wide">
            记录每日的坚持与收获
          </p>
        </header>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-xs text-[var(--text-muted)] mb-1">连续签到</div>
            <div className="text-xl font-medium text-[var(--accent-copper)]">{checkInData.streak}</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <div className="text-2xl mb-1">📅</div>
            <div className="text-xs text-[var(--text-muted)] mb-1">累计签到</div>
            <div className="text-xl font-medium text-[var(--text-primary)]">{checkInData.totalDays}</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--bg-elevated)', border: checkInData.streakFreeze > 0 ? '1px solid rgba(184,149,110,0.5)' : '1px solid var(--border-subtle)' }}>
            <div className="text-2xl mb-1">❄️</div>
            <div className="text-xs text-[var(--text-muted)] mb-1">补签卡</div>
            <div className="text-xl font-medium" style={{ color: checkInData.streakFreeze > 0 ? 'var(--accent-copper)' : 'var(--text-muted)' }}>{checkInData.streakFreeze}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--accent-copper)] transition-colors"
            aria-label="上个月"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-[var(--text-primary)]">{monthName}</h2>
            {!isCurrentMonth && (
              <button
                onClick={goToToday}
                className="text-xs px-2 py-1 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--accent-copper)] transition-colors"
              >
                返回本月
              </button>
            )}
          </div>

          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--accent-copper)] transition-colors"
            aria-label="下个月"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <div className="grid grid-cols-7 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            {WEEKDAYS.map((day, i) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-medium"
                style={{ color: i === 0 || i === 6 ? 'var(--accent-copper)' : 'var(--text-muted)' }}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px p-3" style={{ backgroundColor: 'var(--border-subtle)' }}>
            {calendarDays.map((day, index) => {
              if (!day.isCurrentMonth) {
                return <div key={index} className="aspect-square" />
              }

              const isCheckedIn = day.dateStr && checkInSet.has(day.dateStr)
              const isToday = mounted && day.dateStr === todayStr
              const isFuture = mounted && day.dateStr && new Date(day.dateStr) > new Date()
              const isMakeUp = day.dateStr && isMakeUpSet.has(day.dateStr)

              return (
                <div
                  key={index}
                  className="relative aspect-square flex items-center justify-center"
                >
                  {day.date && (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${isCheckedIn ? 'animate-checkin-glow' : ''} ${isToday ? 'ring-2 ring-[var(--accent-copper)]' : ''} ${isFuture ? 'opacity-30' : ''} ${isMakeUp ? 'border-2 border-dashed border-[var(--accent-amber)]' : ''}`}
                      style={{
                        backgroundColor: isCheckedIn ? 'rgba(184,149,110,0.2)' : 'transparent',
                        color: isCheckedIn ? 'var(--accent-copper)' : isFuture ? 'var(--text-muted)' : 'var(--text-primary)',
                        boxShadow: isCheckedIn ? '0 0 12px rgba(184,149,110,0.4)' : 'none',
                      }}
                    >
                      {day.date}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleCheckIn}
            disabled={checkedInToday}
            className={`px-8 py-3 rounded-full text-base font-medium transition-all duration-300 ${checkedInToday ? 'opacity-60 cursor-default' : 'hover:scale-105 active:scale-95 hover:shadow-lg'}`}
            style={{
              backgroundColor: checkedInToday ? 'var(--bg-elevated)' : 'var(--accent-copper)',
              color: checkedInToday ? 'var(--text-muted)' : 'var(--bg-primary)',
              border: checkedInToday ? '1px solid var(--border-subtle)' : 'none',
              boxShadow: checkedInToday ? 'none' : '0 4px 20px rgba(184,149,110,0.4)',
            }}
          >
            {checkedInToday ? (
              <>
                <span className="mr-2">✓</span>
                今日已签到
              </>
            ) : (
              <>
                <span className="mr-2">📅</span>
                立即签到
              </>
            )}
          </button>

          {!checkedInToday && (
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              连续签到7天可获得补签卡
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(184,149,110,0.2)', boxShadow: '0 0 6px rgba(184,149,110,0.4)' }} />
            <span>已签到</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full ring-2 ring-[var(--accent-copper)]" />
            <span>今天</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-dashed border-[var(--accent-amber)]" />
            <span>补签</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes checkin-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(184,149,110,0.4); }
          50% { box-shadow: 0 0 16px rgba(184,149,110,0.6); }
        }
        .animate-checkin-glow {
          animation: checkin-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
