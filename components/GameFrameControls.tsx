'use client'

interface GameFrameControlsProps {
  isFullscreen: boolean
  onToggleFullscreen: () => void
  onExit: () => void
}

export function FullscreenButton({ isFullscreen, onToggleFullscreen }: { isFullscreen: boolean; onToggleFullscreen: () => void }) {
  return (
    <button
      onClick={onToggleFullscreen}
      className="absolute top-4 right-4 z-30 p-2.5 rounded-lg bg-[var(--bg-primary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] transition-all duration-200 group"
      aria-label={isFullscreen ? '退出全屏' : '进入全屏'}
    >
      {isFullscreen ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--bg-primary)]/90 border border-[var(--border-subtle)] rounded text-[10px] text-[var(--text-secondary)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            ESC 退出
          </span>
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--bg-primary)]/90 border border-[var(--border-subtle)] rounded text-[10px] text-[var(--text-secondary)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            全屏
          </span>
        </>
      )}
    </button>
  )
}

export function ExitButton({ onExit }: { onExit: () => void }) {
  return (
    <div className="absolute bottom-4 left-4 z-30">
      <button
        onClick={onExit}
        className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-[var(--bg-primary)]/80 backdrop-blur-sm border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] active:scale-95"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
      >
        <span className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          退出游戏
        </span>
      </button>
    </div>
  )
}

export default function GameFrameControls({ isFullscreen, onToggleFullscreen, onExit }: GameFrameControlsProps) {
  return (
    <>
      <FullscreenButton isFullscreen={isFullscreen} onToggleFullscreen={onToggleFullscreen} />
      <ExitButton onExit={onExit} />
    </>
  )
}
