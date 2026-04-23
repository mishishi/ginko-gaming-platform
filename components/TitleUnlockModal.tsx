'use client'

import { useEffect, useState } from 'react'

interface TitleUnlockModalProps {
  title: string
  onClose: () => void
}

export default function TitleUnlockModal({ title, onClose }: TitleUnlockModalProps) {
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
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`
        fixed inset-0 z-[100] flex items-center justify-center
        transition-opacity duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      onClick={onClose}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
        }}
      />

      {/* Main content */}
      <div
        className={`
          relative text-center transition-all duration-700
          ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top element */}
        <div className="flex justify-center mb-4">
          <div
            className="text-3xl animate-float"
            style={{ animationDuration: '3s' }}
          >
            ✦
          </div>
        </div>

        {/* Title badge */}
        <div
          className="relative px-8 py-4 rounded-2xl inline-block"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(74, 92, 79, 0.2) 100%)',
            border: '2px solid rgba(168, 85, 247, 0.5)',
            boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)',
          }}
        >
          {/* Corner decorations */}
          <div
            className="absolute top-2 left-2 w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--accent-purple)' }}
          />
          <div
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--accent-purple)' }}
          />
          <div
            className="absolute bottom-2 left-2 w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--accent-purple)' }}
          />
          <div
            className="absolute bottom-2 right-2 w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--accent-purple)' }}
          />

          {/* New title label */}
          <div
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: 'var(--accent-purple)' }}
          >
            获得新称号
          </div>

          {/* Title name */}
          <div
            className="text-3xl"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-primary)',
              textShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
            }}
          >
            {title}
          </div>
        </div>

        {/* Decorative bottom element */}
        <div className="flex justify-center mt-4">
          <div
            className="text-3xl animate-float"
            style={{ animationDuration: '3s', animationDelay: '0.5s' }}
          >
            ✦
          </div>
        </div>

        {/* Shimmer effect */}
        <div
          className={`
            absolute inset-0 rounded-2xl pointer-events-none
            transition-opacity duration-1000
            ${showContent ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            background: 'linear-gradient(110deg, transparent 20%, rgba(168, 85, 247, 0.1) 40%, rgba(168, 85, 247, 0.2) 50%, rgba(168, 85, 247, 0.1) 60%, transparent 80%)',
            backgroundSize: '200% 100%',
            animation: showContent ? 'shimmer 2s ease-in-out infinite' : 'none',
          }}
        />
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
