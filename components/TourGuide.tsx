'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface TourStep {
  target: string
  title: string
  description: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

const TOUR_STEPS: TourStep[] = [
  {
    target: 'h1',
    title: '欢迎来到银古客栈',
    description: '这是您的游戏驿站，每一个游戏都是一段独特的旅程。',
    position: 'bottom',
  },
  {
    target: '.game-card-link',
    title: '珍藏展品',
    description: '每张卡牌代表一个游戏，点击进入开始您的冒险。',
    position: 'top',
  },
  {
    target: 'nav',
    title: '导航菜单',
    description: '从这里可以快速访问各个游戏，享受沉浸式体验。',
    position: 'bottom',
  },
]

export default function TourGuide() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const dismissed = localStorage.getItem('tour-dismissed')
    if (!dismissed) {
      // Small delay to let page render
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('tour-dismissed', 'true')
    setIsVisible(false)
  }

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleDismiss()
    }
  }

  if (!isVisible) return null

  const step = TOUR_STEPS[currentStep]

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={handleDismiss} />

      {/* Spotlight */}
      <div
        className="absolute rounded-lg pointer-events-none"
        style={{
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
          transition: 'all 0.3s ease',
        }}
      />

      {/* Tooltip */}
      <div
        className="absolute z-10 w-72 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-xl pointer-events-auto"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3
            className="text-[var(--text-primary)] font-medium"
            style={{ fontFamily: 'var(--font-serif), Noto Serif SC, serif' }}
          >
            {step.title}
          </h3>
          <button
            onClick={handleDismiss}
            className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors text-xs"
          >
            跳过
          </button>
        </div>
        <p className="text-[var(--text-secondary)] text-sm mb-4">{step.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentStep ? 'bg-[var(--accent-amber)]' : 'bg-[var(--border-subtle)]'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: 'var(--accent-amber)',
              color: 'var(--bg-primary)',
            }}
          >
            {currentStep < TOUR_STEPS.length - 1 ? '下一步' : '开始探索'}
          </button>
        </div>
      </div>
    </div>
  )
}
