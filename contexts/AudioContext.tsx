'use client'

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react'

type SoundType = 'click' | 'success' | 'error' | 'achievement'

interface AudioContextType {
  musicOn: boolean
  sfxOn: boolean
  volume: number
  isHydrated: boolean
  toggleMusic: () => void
  toggleSfx: () => void
  setVolume: (v: number) => void
  playSound: (sound: SoundType) => void
}

const AudioContext = createContext<AudioContextType | null>(null)

const STORAGE_KEYS = {
  music: 'ginko-audio-music',
  sfx: 'ginko-audio-sfx',
  volume: 'ginko-audio-volume',
} as const

export function AudioProvider({ children }: { children: ReactNode }) {
  const [musicOn, setMusicOn] = useState(true)
  const [sfxOn, setSfxOn] = useState(true)
  const [volume, setVolumeState] = useState(50)
  const [sfxLoaded, setSfxLoaded] = useState(false)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const bgAudioRef = useRef<HTMLAudioElement | null>(null)
  const audioBlockedRef = useRef(false)
  const sfxAudioRef = useRef<Record<SoundType, HTMLAudioElement | null>>({
    click: null,
    success: null,
    error: null,
    achievement: null,
  })

  // Initialize SFX audio elements (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    sfxAudioRef.current = {
      click: new Audio('/audio/sfx/click.mp3'),
      success: new Audio('/audio/sfx/success.mp3'),
      error: new Audio('/audio/sfx/error.mp3'),
      achievement: new Audio('/audio/sfx/achievement.mp3'),
    }
    setSfxLoaded(true)
  }, [])

  // Initialize from localStorage
  useEffect(() => {
    const storedMusic = localStorage.getItem(STORAGE_KEYS.music)
    const storedSfx = localStorage.getItem(STORAGE_KEYS.sfx)
    const storedVolume = localStorage.getItem(STORAGE_KEYS.volume)

    if (storedMusic !== null) setMusicOn(storedMusic === 'on')
    if (storedSfx !== null) setSfxOn(storedSfx === 'on')
    if (storedVolume !== null) setVolumeState(Number(storedVolume))
    setIsHydrated(true)
  }, [])

  // Setup background audio
  useEffect(() => {
    if (!bgAudioRef.current) {
      bgAudioRef.current = new Audio('/audio/background.mp3')
      bgAudioRef.current.loop = true
      bgAudioRef.current.volume = volume / 100
    }
    return () => {
      bgAudioRef.current?.pause()
      bgAudioRef.current = null
    }
  }, [])

  // Handle music toggle
  useEffect(() => {
    const audio = bgAudioRef.current
    if (!audio) return

    if (musicOn) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name === 'NotAllowedError') {
            setAudioBlocked(true)
            audioBlockedRef.current = true
          }
        })
      }
    } else {
      audio.pause()
    }
  }, [musicOn])

  // Handle volume change
  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = volume / 100
    }
  }, [volume])

  // Visibility change: pause when hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = bgAudioRef.current
      if (!audio) return
      if (document.hidden) {
        audio.pause()
      } else if (musicOn && !audioBlockedRef.current) {
        audio.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [musicOn])

  const toggleMusic = useCallback(() => {
    setMusicOn(prev => {
      const next = !prev
      localStorage.setItem(STORAGE_KEYS.music, next ? 'on' : 'off')
      // If unblocking audio, try to play immediately
      if (next && audioBlockedRef.current && bgAudioRef.current) {
        bgAudioRef.current.play().catch(() => {})
        setAudioBlocked(false)
      }
      return next
    })
  }, [])

  const toggleSfx = useCallback(() => {
    setSfxOn(prev => {
      const next = !prev
      localStorage.setItem(STORAGE_KEYS.sfx, next ? 'on' : 'off')
      return next
    })
  }, [])

  const setVolume = useCallback((v: number) => {
    setVolumeState(v)
    localStorage.setItem(STORAGE_KEYS.volume, String(v))
  }, [])

  const playSound = useCallback((sound: SoundType) => {
    if (!sfxOn || !sfxLoaded) return
    const audio = sfxAudioRef.current[sound]
    if (audio) {
      audio.currentTime = 0
      audio.volume = volume / 100
      audio.play().catch(() => {})
    }
  }, [sfxOn, volume, sfxLoaded])

  return (
    <AudioContext.Provider value={{ musicOn, sfxOn, volume, isHydrated, toggleMusic, toggleSfx, setVolume, playSound }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}
