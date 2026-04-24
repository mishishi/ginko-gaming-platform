'use client'

import { useState, useEffect } from 'react'

const ONBOARDING_KEY = 'yinqiu-onboarding-completed'

interface OnboardingStep {
  icon: string
  title: string
  description: string
  highlight?: string
}

const STEPS: OnboardingStep[] = [
  {
    icon: '📅',
    title: '每日签到',
    description: '每天签到获得 EXP，连续签到有额外奖励',
    highlight: '周六周日双倍 EXP',
  },
  {
    icon: '🎮',
    title: '玩小游戏',
    description: '在游戏中获得高分，解锁成就',
    highlight: '成就会记录你的每一步里程碑',
  },
  {
    icon: '🏆',
    title: '解锁成就',
    description: '达成特定条件解锁成就，稀有成就更有价值',
    highlight: '成就可分享给好友',
  },
  {
    icon: '👥',
    title: '添加好友',
    description: '在设置中生成好友码，与朋友互动',
    highlight: '查看好友排行榜',
  },
]

export default function OnboardingModal() {
  const [isCompleted, setIsCompleted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if onboarding has been shown before
    const completed = localStorage.getItem(ONBOARDING_KEY)
    if (!completed) {
      // Small delay to let the page load first
      const timer = setTimeout(() => setIsVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setIsVisible(false)
    setIsCompleted(true)
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  if (!isVisible || isCompleted) return null

  const step = STEPS[currentStep]
  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      onClick={handleSkip}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(10, 9, 8, 0.9)' }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl p-6 shadow-xl"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div
          className="absolute top-0 left-0 h-1 rounded-t-2xl transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: 'var(--accent-copper)',
          }}
        />

        {/* Step indicator */}
        <div className="text-xs text-center mb-4" style={{ color: 'var(--text-muted)' }}>
          {currentStep + 1} / {STEPS.length}
        </div>

        {/* Icon */}
        <div
          className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '2px solid var(--accent-copper)',
            boxShadow: '0 0 30px rgba(184, 149, 110, 0.3)',
          }}
        >
          {step.icon}
        </div>

        {/* Title */}
        <h2
          className="text-xl font-medium text-center mb-2"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-serif), serif',
          }}
        >
          {step.title}
        </h2>

        {/* Description */}
        <p
          className="text-sm text-center mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          {step.description}
        </p>

        {/* Highlight */}
        {step.highlight && (
          <div
            className="text-xs text-center px-3 py-2 rounded-lg mb-6"
            style={{
              backgroundColor: 'rgba(74, 92, 79, 0.3)',
              color: 'var(--accent-copper)',
              border: '1px solid rgba(184, 149, 110, 0.2)',
            }}
          >
            ✦ {step.highlight}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            跳过
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: 'var(--accent-copper)',
              color: 'var(--bg-primary)',
            }}
          >
            {currentStep < STEPS.length - 1 ? '下一步' : '开始探索'}
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-4'
                  : ''
              }`}
              style={{
                backgroundColor:
                  index === currentStep
                    ? 'var(--accent-copper)'
                    : 'var(--bg-hover)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
