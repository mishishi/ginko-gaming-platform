'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface GameStatus {
  reachable: boolean
  latency: number | null
}

interface GameStatusMap {
  [slug: string]: GameStatus
}

interface GameStatusContextType {
  status: GameStatusMap
  isLoading: boolean
}

const GameStatusContext = createContext<GameStatusContextType>({
  status: {},
  isLoading: true,
})

export function useGameStatus() {
  return useContext(GameStatusContext)
}

export function GameStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<GameStatusMap>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null

    async function fetchStatus() {
      try {
        const response = await fetch('/api/game-status')
        if (response.ok) {
          const data = await response.json()
          setStatus(data)
        }
      } catch {
        // Keep default status (all unreachable) on error
      } finally {
        setIsLoading(false)
      }
    }

    const startInterval = () => {
      if (!intervalId) intervalId = setInterval(fetchStatus, 30000)
    }
    const stopInterval = () => {
      if (intervalId) { clearInterval(intervalId); intervalId = null }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) stopInterval()
      else { fetchStatus(); startInterval() }
    }

    fetchStatus()
    startInterval()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      stopInterval()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <GameStatusContext.Provider value={{ status, isLoading }}>
      {children}
    </GameStatusContext.Provider>
  )
}
