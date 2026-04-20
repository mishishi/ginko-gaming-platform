'use client'

import { useState, useEffect, useCallback } from 'react'

const TOUR_SEEN_KEY = 'hasSeenTour'

export function useTour() {
  const [hasSeenTour, setHasSeenTour] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const seen = localStorage.getItem(TOUR_SEEN_KEY) === 'true'
      setHasSeenTour(seen)
    } catch {
      // localStorage not available
    }
    setIsLoading(false)
  }, [])

  const completeTour = useCallback(() => {
    setHasSeenTour(true)
    try {
      localStorage.setItem(TOUR_SEEN_KEY, 'true')
    } catch {
      // localStorage not available
    }
  }, [])

  const resetTour = useCallback(() => {
    setHasSeenTour(false)
    try {
      localStorage.removeItem(TOUR_SEEN_KEY)
    } catch {
      // localStorage not available
    }
  }, [])

  return { hasSeenTour, isLoading, completeTour, resetTour }
}
