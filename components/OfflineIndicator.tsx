'use client'

import { useState, useEffect } from 'react'

export default function OfflineIndicator() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setOffline(!navigator.onLine)

    const handleOnline = () => setOffline(false)
    const handleOffline = () => setOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!offline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-black text-xs py-1.5 text-center z-50 font-medium">
      网络连接已断开，部分功能可能不可用
    </div>
  )
}
