'use client'

import { useState, useEffect } from 'react'
import { DailyTaskStatus } from '@/hooks/useDailyTasks'

interface DailyTasksCardProps {
  tasks: DailyTaskStatus[]
  totalExp: number
  onClaim?: (taskId: string) => void
}

function TaskItem({ task, onClaim }: { task: DailyTaskStatus; onClaim?: (id: string) => void }) {
  const handleClick = () => {
    if (!task.completed && onClaim) {
      onClaim(task.id)
    }
  }

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
        task.completed
          ? 'opacity-70'
          : 'cursor-pointer hover:bg-[var(--bg-secondary)]'
      }`}
      style={{
        backgroundColor: task.completed ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.15)',
      }}
      onClick={handleClick}
      role={task.completed ? undefined : 'button'}
      tabIndex={task.completed ? undefined : 0}
      onKeyDown={task.completed ? undefined : (e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick()
      }}
    >
      <span className="text-xl" aria-hidden="true">{task.icon}</span>
      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-medium"
          style={{ color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}
        >
          {task.desc}
        </div>
      </div>
      <div
        className="text-xs px-2 py-1 rounded-full"
        style={{
          backgroundColor: task.completed
            ? 'rgba(184,149,110,0.2)'
            : 'var(--bg-elevated)',
          color: task.completed ? 'var(--accent-copper)' : 'var(--text-secondary)',
        }}
      >
        +{task.exp} EXP
      </div>
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: task.completed ? 'var(--accent-copper)' : 'transparent',
          border: task.completed ? 'none' : '1.5px solid var(--border-subtle)',
        }}
      >
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </div>
  )
}

export default function DailyTasksCard({ tasks, totalExp, onClaim }: DailyTasksCardProps) {
  const [mounted, setMounted] = useState(false)
  const completedCount = tasks.filter(t => t.completed).length

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden="true">📋</span>
          <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            今日任务
          </h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'rgba(184,149,110,0.15)',
              color: 'var(--accent-copper)',
            }}
          >
            {completedCount}/{tasks.length}
          </span>
        </div>
        {mounted && (
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            今日已得 +{totalExp} EXP
          </div>
        )}
      </div>

      <div className="space-y-2">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onClaim={onClaim} />
        ))}
      </div>

      {completedCount === tasks.length && (
        <div className="mt-3 text-center text-sm" style={{ color: 'var(--accent-copper)' }}>
          🎉 今日任务已全部完成
        </div>
      )}
    </div>
  )
}
