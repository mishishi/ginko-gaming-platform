'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Game } from '@/lib/games'
import { useRouter } from 'next/navigation'
import Skeleton from './Skeleton'

interface GameFrameProps {
  game: Game
}

export default function GameFrame({ game }: GameFrameProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showExitHint, setShowExitHint] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
  }, [])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
  }, [])

  const handleRetry = useCallback(() => {
    setIsLoading(true)
    setHasError(false)
    if (iframeRef.current) {
      iframeRef.current.src = game.devUrl
    }
  }, [game.devUrl])

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch {
      // Fullscreen not supported or denied
    }
  }, [])

  const handleExitGame = useCallback(() => {
    router.push('/')
  }, [router])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  })

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-4rem)]"
      onMouseEnter={() => setShowExitHint(true)}
      onMouseLeave={() => setShowExitHint(false)}
    >
      {/* Loading skeleton */}
      {isLoading && !hasError && (
        <Skeleton color={game.color} glowColor={game.glowColor} />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)] z-20">
          <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <div className="text-4xl">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-[var(--text-primary)] text-lg font-medium">
                游戏加载失败
              </span>
              <span className="text-[var(--text-secondary)] text-sm">
                请检查网络连接后重试
              </span>
            </div>
            <button
              onClick={handleRetry}
              className="px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: game.color }}
            >
              重试
            </button>
          </div>
        </div>
      )}

      {/* iframe */}
      {!hasError && (
        <iframe
          ref={iframeRef}
          src={game.devUrl}
          className="w-full h-full border-0"
          onLoad={handleLoad}
          onError={handleError}
          title={game.title}
          allow="fullscreen"
          allowFullScreen
        />
      )}

      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
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

      {/* Exit game overlay */}
      <div className="absolute bottom-4 left-4 z-30">
        <button
          onClick={handleExitGame}
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

      {/* Reserved: postMessage communication */}
      {/* Games can send messages via window.parent.postMessage() */}
    </div>
  )
}
