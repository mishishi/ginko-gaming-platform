'use client'

import { useEffect, useState } from 'react'
import { AchievementRarity, RARITY_CONFIG } from '@/components/AchievementBadge'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: AchievementRarity
}

interface AchievementUnlockModalProps {
  achievement: Achievement | null
  onClose: () => void
}

export default function AchievementUnlockModal({ achievement, onClose }: AchievementUnlockModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      // Small delay to trigger entrance animation
      requestAnimationFrame(() => {
        setIsAnimating(true)
      })
      // Auto dismiss after 3 seconds
      const timer = setTimeout(() => {
        handleClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [achievement])

  const handleClose = () => {
    setIsAnimating(false)
    // Wait for exit animation to finish
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 400)
  }

  if (!isVisible || !achievement) return null

  const rarityConfig = RARITY_CONFIG[achievement.rarity]

  return (
    <div
      className={`
        fixed inset-0 z-[200] flex items-center justify-center
        transition-opacity duration-400 ease-out
        ${isAnimating ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievement-title"
    >
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(10, 9, 8, 0.85)' }}
      />

      {/* Particle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: rarityConfig.border,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${1 + Math.random() * 1.5}s`,
              boxShadow: `0 0 6px ${rarityConfig.glow}`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div
        className={`
          relative flex flex-col items-center gap-6 p-8
          transition-all duration-500 ease-out
          ${isAnimating ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ring behind icon */}
        <div
          className="absolute inset-0 rounded-full blur-2xl animate-pulse-slow"
          style={{
            backgroundColor: rarityConfig.glow,
            opacity: 0.4,
            transform: 'scale(1.5)',
          }}
        />

        {/* Achievement icon container */}
        <div
          className={`
            relative w-32 h-32 rounded-full flex items-center justify-center
            animate-icon-entrance
          `}
          style={{
            backgroundColor: 'rgba(20, 18, 16, 0.9)',
            border: `3px solid ${rarityConfig.border}`,
            boxShadow: `0 0 40px ${rarityConfig.glow}, inset 0 0 20px rgba(0,0,0,0.5)`,
          }}
        >
          <span className="text-6xl animate-bounce-subtle">{achievement.icon}</span>
        </div>

        {/* Rarity badge */}
        <div
          className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-fade-in-down"
          style={{
            backgroundColor: rarityConfig.bg,
            border: `1px solid ${rarityConfig.border}`,
            color: rarityConfig.border,
            animationDelay: '0.2s',
          }}
        >
          {rarityConfig.label} 成就
        </div>

        {/* Achievement name */}
        <h2
          id="achievement-title"
          className="text-3xl font-serif text-center animate-fade-in-up"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-serif), Noto Serif SC, serif',
            textShadow: `0 0 20px ${rarityConfig.glow}`,
            animationDelay: '0.3s',
          }}
        >
          {achievement.name}
        </h2>

        {/* Achievement description */}
        <p
          className="text-sm text-center animate-fade-in-up"
          style={{
            color: 'var(--text-muted)',
            animationDelay: '0.4s',
          }}
        >
          {achievement.description}
        </p>

        {/* Tap to continue hint */}
        <p
          className="text-xs text-center animate-pulse mt-4"
          style={{ color: 'var(--text-muted)', animationDelay: '0.6s' }}
        >
          点击任意位置继续
        </p>
      </div>

      <style jsx>{`
        @keyframes particle {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(0);
            opacity: 0;
          }
        }
        .animate-particle {
          animation: particle 2s ease-out forwards;
        }
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 1s ease-in-out infinite;
        }
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes icon-entrance {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          60% {
            transform: scale(1.2) rotate(10deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        .animate-icon-entrance {
          animation: icon-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1.5);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.6);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
