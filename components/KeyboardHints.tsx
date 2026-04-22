'use client'

interface KeyboardHintsProps {
  visible: boolean
}

export default function KeyboardHints({ visible }: KeyboardHintsProps) {
  if (!visible) return null

  return (
    <div
      className="absolute bottom-4 right-4 z-30 flex items-center gap-3 px-4 py-2 rounded-lg bg-[var(--bg-primary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <span className="flex items-center gap-1.5">
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono text-[10px]">ESC</kbd>
        退出
      </span>
      <span className="w-px h-3 bg-[var(--border-subtle)]" />
      <span className="flex items-center gap-1.5">
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono text-[10px]">R</kbd>
        刷新
      </span>
      <span className="w-px h-3 bg-[var(--border-subtle)]" />
      <span className="flex items-center gap-1.5">
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono text-[10px]">F</kbd>
        全屏
      </span>
    </div>
  )
}
