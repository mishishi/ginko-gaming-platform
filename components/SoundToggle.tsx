'use client'

import { useAudio } from '@/contexts/AudioContext'

export default function SoundToggle() {
  const { sfxOn, toggleSfx } = useAudio()

  return (
    <button
      onClick={toggleSfx}
      className="p-2 rounded-lg transition-all duration-200 active:scale-95 hover:bg-[var(--bg-elevated)]"
      aria-label={sfxOn ? '关闭音效' : '开启音效'}
      title={sfxOn ? '关闭音效' : '开启音效'}
    >
      {sfxOn ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  )
}
