'use client'

import { useState, useEffect, useCallback } from 'react'
import { GameStats } from '@/hooks/useGameStats'
import { CheckInData } from '@/hooks/useCheckIn'

const DAILY_TASKS_KEY = 'yinqiu-daily-tasks'

export interface DailyTask {
  id: string
  desc: string
  exp: number
  icon: string
}

export interface DailyTaskStatus {
  id: string
  desc: string
  exp: number
  icon: string
  completed: boolean
}

export const DAILY_TASKS: DailyTask[] = [
  { id: 'daily_checkin', desc: '每日签到', exp: 5, icon: '📅' },
  { id: 'play_once', desc: '小试牛刀 · 玩1局', exp: 3, icon: '🎮' },
  { id: 'play_three', desc: '游戏挑战 · 玩3局', exp: 10, icon: '🏆' },
  { id: 'weekend_play', desc: '周末限定 · 周末玩1局', exp: 8, icon: '🌟' },
]

interface DailyTasksData {
  date: string           // "2026-04-23"
  completedTasks: string[]  // task IDs
  expEarned: number
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function useDailyTasks(stats: GameStats, checkInData: CheckInData) {
  const [tasksData, setTasksData] = useState<DailyTasksData>({
    date: getDateString(new Date()),
    completedTasks: [],
    expEarned: 0,
  })

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DAILY_TASKS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as DailyTasksData
        const today = getDateString(new Date())
        // Reset if it's a new day
        if (parsed.date !== today) {
          parsed.date = today
          parsed.completedTasks = []
          parsed.expEarned = 0
          localStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(parsed))
        }
        setTasksData(parsed)
      }
    } catch (e) {
      console.warn('Failed to load daily tasks from localStorage:', e)
    }
  }, [])

  // Check which tasks are satisfied today
  const getTasksWithStatus = useCallback((): DailyTaskStatus[] => {
    const today = new Date()
    const todayStr = getDateString(today)
    const isTodayWeekend = isWeekend(today)

    const todaySessions = stats.gameSessions.filter(s => s.date === todayStr)
    const todayPlayCount = todaySessions.length

    // Has checked in today
    const checkedInToday = checkInData.checkInHistory.some(
      e => e.date === todayStr
    )

    // Weekend task requires weekend
    const weekendTask = DAILY_TASKS.find(t => t.id === 'weekend_play')
    const weekendTaskValid = weekendTask && isTodayWeekend

    return DAILY_TASKS.map(task => {
      let completed = tasksData.completedTasks.includes(task.id)

      if (task.id === 'daily_checkin') {
        completed = completed || checkedInToday
      } else if (task.id === 'play_once') {
        completed = completed || todayPlayCount >= 1
      } else if (task.id === 'play_three') {
        completed = completed || todayPlayCount >= 3
      } else if (task.id === 'weekend_play') {
        completed = completed || (todayPlayCount >= 1 && isTodayWeekend)
      }

      return { ...task, completed }
    })
  }, [stats.gameSessions, checkInData.checkInHistory, tasksData.completedTasks])

  // Manually claim a task reward (call this when game play triggers task completion)
  const claimTask = useCallback((taskId: string): number => {
    const today = getDateString(new Date())
    const task = DAILY_TASKS.find(t => t.id === taskId)
    if (!task) return 0

    const newData: DailyTasksData = {
      date: today,
      completedTasks: [...tasksData.completedTasks],
      expEarned: tasksData.expEarned,
    }

    if (!newData.completedTasks.includes(taskId)) {
      newData.completedTasks.push(taskId)
      newData.expEarned += task.exp
      setTasksData(newData)
      try {
        localStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(newData))
      } catch (e) {
        console.warn('Failed to save daily tasks to localStorage:', e)
      }
      return task.exp
    }
    return 0
  }, [tasksData])

  // Auto-check and update tasks (called by game completion, etc.)
  const refreshTasks = useCallback((): { taskId: string; exp: number }[] => {
    const tasks = getTasksWithStatus()
    const today = getDateString(new Date())
    const newlyCompleted: { taskId: string; exp: number }[] = []

    const newData: DailyTasksData = {
      date: today,
      completedTasks: [...tasksData.completedTasks],
      expEarned: tasksData.expEarned,
    }

    let changed = false
    for (const task of tasks) {
      if (task.completed && !newData.completedTasks.includes(task.id)) {
        newData.completedTasks.push(task.id)
        newData.expEarned += task.exp
        newlyCompleted.push({ taskId: task.id, exp: task.exp })
        changed = true
      }
    }

    if (changed) {
      setTasksData(newData)
      try {
        localStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(newData))
      } catch (e) {
        console.warn('Failed to save daily tasks to localStorage:', e)
      }
    }

    return newlyCompleted
  }, [getTasksWithStatus, tasksData])

  // Check if all tasks are done
  const allTasksCompleted = getTasksWithStatus().every(t => t.completed)

  return {
    tasksData,
    getTasksWithStatus,
    claimTask,
    refreshTasks,
    allTasksCompleted,
  }
}
