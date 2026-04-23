'use client'

import { useEffect, useState } from 'react'

const LEVEL_NAMES = ['新晋旅人', '客栈常客', '银古居士', '迷雾行者', '命运探索者', '客栈传奇']

interface LevelUpModalProps {
  level: number
  onClose: () => void
}

export default function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true)
      setTimeout(() => setShowContent(true), 300)
    })

    // Auto-close after animation
    const timer = setTimeout(() => {
      setShowContent(false)
      setTimeout(onClose, 500)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const levelName = LEVEL_NAMES[level - 1] || LEVEL_NAMES[LEVEL_NAMES.length - 1]

  return (
    <div
      className={`
        fixed inset-0 z-[100] flex items-center justify-center
        transition-opacity duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(184, 149, 110, 0.3) 0%, transparent 50%)',
        }}
      />

      {/* Main content */}
      <div
        className={`
          relative text-center transition-all duration-700
          ${showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            backgroundColor: 'rgba(184, 149, 110, 0.2)',
            animationDuration: '2s',
          }}
        />

        {/* Level circle */}
        <div
          className="relative w-48 h-48 rounded-full flex flex-col items-center justify-center mx-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(74, 92, 79, 0.9) 0%, rgba(30, 40, 30, 0.95) 100%)',
            border: '3px solid var(--accent-amber)',
            boxShadow: '0 0 60px rgba(184, 149, 110, 0.5), inset 0 0 30px rgba(184, 149, 110, 0.2)',
          }}
        >
          {/* Level number */}
          <div
            className="text-6xl font-bold animate-breathe"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--accent-amber)',
              textShadow: '0 0 30px rgba(212, 165, 116, 0.8)',
            }}
          >
            {level}
          </div>

          {/* Level label */}
          <div
            className="text-sm tracking-widest uppercase"
            style={{ color: 'var(--accent-copper)' }}
          >
            LEVEL UP
          </div>
        </div>

        {/* Level name */}
        <div
          className="mt-6 text-2xl"
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--accent-amber)',
            textShadow: '0 0 20px rgba(212, 165, 116, 0.5)',
          }}
        >
          {levelName}
        </div>

        {/* Decorative lines */}
        <div className="mt-4 flex justify-center gap-4">
          <div
            className="h-px w-16 transition-all duration-1000"
            style={{
              background: 'linear-gradient(to right, transparent, var(--accent-amber))',
              opacity: showContent ? 1 : 0,
              transitionDelay: '0.5s',
            }}
          />
          <div
            className="text-xl"
            style={{ color: 'var(--accent-amber)' }}
          >
            ✦
          </div>
          <div
            className="h-px w-16 transition-all duration-1000"
            style={{
              background: 'linear-gradient(to left, transparent, var(--accent-amber))',
              opacity: showContent ? 1 : 0,
              transitionDelay: '0.5s',
            }}
          />
        </div>
      </div>

      {/* Click hint */}
      <div
        className={`
          absolute bottom-16 text-sm transition-all duration-500
          ${showContent ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ color: 'var(--text-muted)' }}
      >
        点击任意处关闭
      </div>
    </div>
  )
}
