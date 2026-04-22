'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Game } from '@/lib/games'
import { useRouter } from 'next/navigation'
import Skeleton from './Skeleton'
import ErrorBoundary from './ErrorBoundary'
import { useRecentlyPlayed } from '@/hooks/useRecentlyPlayed'
import { useGameStats } from '@/hooks/useGameStats'
import { useToast } from '@/contexts/ToastContext'
import LoadingProgress from './LoadingProgress'
import GameFrameError from './GameFrameError'
import KeyboardHints from './KeyboardHints'
import GameFrameControls from './GameFrameControls'

interface GameFrameProps {
  game: Game
}

export default function GameFrame({ game }: GameFrameProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showKeyboardHints, setShowKeyboardHints] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { markPlayed } = useRecentlyPlayed()
  const { recordPlay } = useGameStats()
  const { showToast } = useToast()

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
    markPlayed(game.slug)
    // Record play and notify if achievements unlocked
    const { newlyUnlocked } = recordPlay(game.slug, 0)
    for (const achievement of newlyUnlocked) {
      showToast(achievement.name, 'achievement', 4000, achievement.icon, achievement.rarity)
    }
  }, [markPlayed, recordPlay, showToast, game.slug])

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA') {
        return
      }

      // ESC - exit game
      if (e.key === 'Escape' && !isFullscreen) {
        handleExitGame()
      }
      // F - toggle fullscreen
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        toggleFullscreen()
      }
      // R - reload iframe
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        if (iframeRef.current) {
          setIsLoading(true)
          setHasError(false)
          iframeRef.current.src = game.devUrl
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, handleExitGame, toggleFullscreen, game.devUrl])

  // Hide keyboard hints after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowKeyboardHints(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Simulate loading progress bar
  useEffect(() => {
    if (!isLoading || hasError) {
      setLoadingProgress(100)
      return
    }
    setLoadingProgress(0)
    let interval: ReturnType<typeof setInterval> | null = null
    const tick = () => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }
    const startInterval = () => {
      if (!interval) interval = setInterval(tick, 300)
    }
    const stopInterval = () => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
    }
    startInterval()
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopInterval()
      } else {
        startInterval()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      stopInterval()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isLoading, hasError])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  })

  // Loading timeout: force error state after 30s if iframe never loads
  useEffect(() => {
    if (!isLoading || hasError) return
    const timeout = setTimeout(() => {
      setIsLoading(false)
      setHasError(true)
    }, 30000)
    return () => clearTimeout(timeout)
  }, [isLoading, hasError])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-4rem)]"
    >
      {/* Loading progress bar */}
      {isLoading && !hasError && (
        <LoadingProgress
          progress={loadingProgress}
          color={game.color}
          glowColor={game.glowColor}
        />
      )}

      {/* Loading skeleton */}
      {isLoading && !hasError && (
        <Skeleton color={game.color} glowColor={game.glowColor} />
      )}

      {/* Error state */}
      {hasError && (
        <GameFrameError game={game} onRetry={handleRetry} />
      )}

      {/* iframe */}
      {!hasError && (
        <ErrorBoundary onRetry={handleRetry}>
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
        </ErrorBoundary>
      )}

      {/* Game controls (fullscreen, exit) */}
      <GameFrameControls
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onExit={handleExitGame}
      />

      {/* Keyboard hints */}
      <KeyboardHints visible={showKeyboardHints && !isLoading && !hasError} />

      {/* Reserved: postMessage communication */}
      {/* Games can send messages via window.parent.postMessage() */}
    </div>
  )
}
