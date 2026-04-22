'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react'
import { AchievementRarity, RARITY_CONFIG } from '@/components/AchievementBadge'

type ToastType = 'success' | 'error' | 'info' | 'achievement'

interface Toast {
  id: number
  message: string
  type: ToastType
  duration?: number
  icon?: string
  rarity?: AchievementRarity
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number, icon?: string, rarity?: AchievementRarity) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutIdsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
      timeoutIdsRef.current.clear()
    }
  }, [])

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000, icon?: string, rarity?: AchievementRarity) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type, duration, icon, rarity }])

    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
        timeoutIdsRef.current.delete(id)
      }, duration)
      timeoutIdsRef.current.set(id, timeoutId)
    }
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast rendered at body level via portal */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
        style={{ maxWidth: 320 }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-fade-in-up"
            role="alert"
          >
            <div
              className="px-4 py-3 rounded-lg shadow-lg border text-sm font-medium backdrop-blur-sm"
              style={
                toast.type === 'achievement'
                  ? {
                      backgroundColor: 'rgba(20, 18, 16, 0.98)',
                      borderColor: toast.rarity ? RARITY_CONFIG[toast.rarity].border : 'var(--accent-copper)',
                      color: '#e8e4df',
                      boxShadow: toast.rarity ? `0 0 20px ${RARITY_CONFIG[toast.rarity].glow}` : '0 4px 16px rgba(0,0,0,0.3)',
                    }
                  : toast.type === 'success'
                  ? {
                      backgroundColor: 'rgba(107, 155, 122, 0.95)',
                      borderColor: 'var(--accent-green)',
                      color: '#e8e4df',
                    }
                  : toast.type === 'error'
                  ? {
                      backgroundColor: 'rgba(212, 132, 90, 0.95)',
                      borderColor: 'var(--accent-orange)',
                      color: '#e8e4df',
                    }
                  : {
                      backgroundColor: 'rgba(30, 29, 28, 0.95)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }
              }
            >
              {toast.type === 'achievement' ? (
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" style={{ fontSize: 24 }}>
                    {toast.icon || '🏆'}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider opacity-70">成就解锁</span>
                      {toast.rarity && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: RARITY_CONFIG[toast.rarity].bg,
                            border: `1px solid ${RARITY_CONFIG[toast.rarity].border}`,
                            color: RARITY_CONFIG[toast.rarity].border,
                          }}
                        >
                          {RARITY_CONFIG[toast.rarity].label}
                        </span>
                      )}
                    </div>
                    <span>{toast.message}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {toast.type === 'success' && <span aria-hidden="true">✓</span>}
                  {toast.type === 'error' && <span aria-hidden="true">✕</span>}
                  <span>{toast.message}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
