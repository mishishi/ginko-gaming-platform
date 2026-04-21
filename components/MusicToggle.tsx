'use client'

import { useAudio } from '@/contexts/AudioContext'

export default function MusicToggle() {
  const { musicOn, toggleMusic } = useAudio()

  return (
    <button
      onClick={toggleMusic}
      style={{
        position: 'fixed',
        top: '80px',
        right: '16px',
        zIndex: 9999,
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#c9a84c',
        border: '2px solid #f5d89a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      }}
      aria-label={musicOn ? '关闭背景音乐' : '开启背景音乐'}
    >
      {musicOn ? '🎵' : '🔇'}
    </button>
  )
}
