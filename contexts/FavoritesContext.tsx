'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { useToast } from './ToastContext'

interface FavoritesContextType {
  favorites: string[]
  toggleFavorite: (slug: string) => void
  isLoaded: boolean
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

const FAVORITES_KEY = 'game-favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { showToast } = useToast()

  // Read from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch {
      showToast('无法加载收藏数据', 'error')
    }
    setIsLoaded(true)
  }, [showToast])

  // Listen for storage changes from other tabs
  useEffect(() => {
    function handleStorageChange() {
      try {
        const stored = localStorage.getItem(FAVORITES_KEY)
        if (stored) {
          setFavorites(JSON.parse(stored))
        }
      } catch {
        // ignore
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
      } catch {
        showToast('无法保存收藏', 'error')
      }
      return next
    })
  }, [showToast])

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isLoaded }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return context
}
