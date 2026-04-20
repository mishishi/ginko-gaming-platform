'use client'

import { useEffect, useState, useCallback } from 'react'

interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
}

function KeyboardIcon() {
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
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
      <path d="M6 8h.001" />
      <path d="M10 8h.001" />
      <path d="M14 8h.001" />
      <path d="M18 8h.001" />
      <path d="M8 12h.001" />
      <path d="M12 12h.001" />
      <path d="M16 12h.001" />
      <path d="M7 16h10" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  )
}

interface ShortcutItemProps {
  keys: string[]
  description: string
}

function ShortcutItem({ keys, description }: ShortcutItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[var(--text-secondary)] text-sm">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <span key={index} className="flex items-center gap-1">
            <kbd className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)]">
              {key}
            </kbd>
            {index < keys.length - 1 && (
              <span className="text-[var(--text-muted)] text-xs">/</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  // Close on escape
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm mx-4 p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <KeyboardIcon />
            <h2 id="keyboard-shortcuts-title" className="text-lg font-medium">
              键盘快捷键
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)]"
            aria-label="关闭"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--border-subtle)] mb-4" />

        {/* Shortcuts list */}
        <div className="space-y-1">
          <ShortcutItem keys={['←', '→']} description="在游戏卡片间导航" />
          <ShortcutItem keys={['↑', '↓']} description="上下行导航" />
          <ShortcutItem keys={['Home']} description="跳转到第一个游戏" />
          <ShortcutItem keys={['End']} description="跳转到最后一个游戏" />
          <div className="h-px bg-[var(--border-subtle)] my-2" />
          <ShortcutItem keys={['R']} description="刷新游戏页面" />
          <ShortcutItem keys={['F']} description="切换全屏模式" />
          <ShortcutItem keys={['ESC']} description="退出游戏 / 关闭菜单" />
          <div className="h-px bg-[var(--border-subtle)] my-2" />
          <ShortcutItem keys={['?']} description="显示此帮助" />
        </div>

        {/* Footer hint */}
        <p className="mt-4 text-xs text-center text-[var(--text-muted)]">
          在输入框中时快捷键不生效
        </p>
      </div>
    </div>
  )
}

// Hook to manage the keyboard shortcuts help modal
export function useKeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  // Global keyboard listener for ? key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA') {
        return
      }

      // Don't trigger if any modal is already open
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) {
        return
      }

      if (e.key === '?') {
        e.preventDefault()
        toggle()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle])

  return { isOpen, open, close, toggle }
}
