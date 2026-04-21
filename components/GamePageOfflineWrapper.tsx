'use client'

import { useState, useEffect } from 'react'
import OfflineGameModal from '@/components/OfflineGameModal'

interface GamePageOfflineWrapperProps {
  game: {
    playable: boolean
  }
  children: React.ReactNode
}

export default function GamePageOfflineWrapper({ game, children }: GamePageOfflineWrapperProps) {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline === false && game.playable) {
    return <OfflineGameModal />
  }

  return <>{children}</>
}
