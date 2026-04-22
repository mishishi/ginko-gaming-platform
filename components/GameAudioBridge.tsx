'use client'

import { useEffect } from 'react'
import { useAudio } from '@/contexts/AudioContext'

const ALLOWED_ORIGINS = [
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'https://idol.yourdomain.com',
  'https://quiz.yourdomain.com',
  'https://fate.yourdomain.com',
]

type SoundType = 'click' | 'success' | 'error' | 'achievement'

interface GameMessage {
  type: 'playSound' | 'setMusic' | 'getMusicState'
  sound?: SoundType
  value?: boolean
}

export default function GameAudioBridge() {
  const { playSound, musicOn, toggleMusic } = useAudio()

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin
      if (!ALLOWED_ORIGINS.includes(event.origin)) {
        return
      }

      const data = event.data as GameMessage

      switch (data.type) {
        case 'playSound':
          if (data.sound) {
            playSound(data.sound)
          }
          break
        case 'setMusic':
          if (typeof data.value === 'boolean') {
            if (data.value !== musicOn) {
              toggleMusic()
            }
          }
          break
        case 'getMusicState':
          // Could send state back via postMessage if needed
          break
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [playSound, musicOn, toggleMusic])

  // This component doesn't render anything
  return null
}
