'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const SOUND_ENABLED_KEY = 'sound-enabled'

// Web Audio API context singleton
let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return audioContext
}

// Generate a subtle click/tap sound using Web Audio API
function playClickSound() {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Subtle sine wave click
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05)

    // Quick fade out
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.08)
  } catch {
    // Audio not available
  }
}

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Load sound preference from localStorage
    try {
      const stored = localStorage.getItem(SOUND_ENABLED_KEY)
      if (stored !== null) {
        setSoundEnabled(stored === 'true')
      }
    } catch {
      // localStorage not available
    }
    setInitialized(true)
  }, [])

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const newValue = !prev
      try {
        localStorage.setItem(SOUND_ENABLED_KEY, String(newValue))
      } catch {
        // localStorage not available
      }
      return newValue
    })
  }, [])

  // Play a subtle click sound for UI feedback
  const playClick = useCallback(() => {
    if (soundEnabled) {
      playClickSound()
    }
  }, [soundEnabled])

  return { soundEnabled, toggleSound, playClick, initialized }
}
