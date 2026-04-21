'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTour } from '@/hooks/useTour'
import LanternDecoration from './LanternDecoration'

const games = [
  { slug: 'idol', name: '偶像', desc: '抽取你的专属偶像' },
  { slug: 'quiz', name: '竞技', desc: '知识对决脑力比拼' },
  { slug: 'fate', name: '命运', desc: '八字命盘探索命运' },
]

function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 justify-center" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i === current ? 'bg-[var(--accent-copper)] w-4' : 'bg-[var(--text-muted)]'
          }`}
        />
      ))}
    </div>
  )
}

function StepWelcome() {
  return (
    <div className="flex flex-col items-center gap-6 text-center animate-fade-in">
      <div className="flex gap-4">
        <LanternDecoration size="sm" className="animate-float" />
        <h2 className="font-serif text-3xl text-[var(--accent-copper)]" style={{ fontFamily: 'var(--font-serif), serif' }}>
          银古客栈
        </h2>
        <LanternDecoration size="sm" className="animate-float" style={{ animationDelay: '0.5s' }} />
      </div>
      <div className="w-64 h-px bg-gradient-to-r from-transparent via-[var(--accent-copper)] to-transparent" />
      <p className="text-[var(--text-secondary)] text-lg">旅人的游戏驿站</p>
    </div>
  )
}

function StepGames() {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <h3 className="text-[var(--accent-silver)] font-serif" style={{ fontFamily: 'var(--font-serif), serif' }}>
        探索游戏
      </h3>
      <div className="flex gap-4">
        {games.map((game) => (
          <div key={game.slug} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] w-28">
            <div className="w-12 h-12 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center text-2xl">
              {game.slug === 'idol' ? '🎴' : game.slug === 'quiz' ? '🧠' : '🔮'}
            </div>
            <span className="text-[var(--text-primary)] text-sm font-medium">{game.name}</span>
            <span className="text-[var(--text-muted)] text-xs">{game.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepShortcuts() {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <h3 className="text-[var(--accent-silver)] font-serif" style={{ fontFamily: 'var(--font-serif), serif' }}>
        快捷操作
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'G', desc: '返回首页' },
          { key: '1-3', desc: '快速跳转游戏' },
          { key: 'ESC', desc: '退出全屏/返回' },
          { key: 'F', desc: '切换全屏' },
        ].map(({ key, desc }) => (
          <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <kbd className="px-2 py-1 rounded bg-[var(--bg-elevated)] text-[var(--accent-copper)] text-sm font-mono">{key}</kbd>
            <span className="text-[var(--text-secondary)] text-sm">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepComplete() {
  return (
    <div className="flex flex-col items-center gap-6 text-center animate-fade-in">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent-copper)] to-[var(--accent-copper)]/50 flex items-center justify-center animate-breathe">
          <span className="text-3xl">✓</span>
        </div>
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-[var(--accent-copper)]/20 animate-ping" />
      </div>
      <h3 className="text-xl font-serif text-[var(--accent-copper)]" style={{ fontFamily: 'var(--font-serif), serif' }}>
        欢迎来到银古客栈
      </h3>
      <p className="text-[var(--text-secondary)]">开始你的游戏之旅吧</p>
    </div>
  )
}

export default function TourGuide() {
  const { hasSeenTour, isLoading, completeTour } = useTour()
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1)
    } else {
      close()
      completeTour()
    }
  }, [currentStep, close, completeTour])

  const handleSkip = useCallback(() => {
    close()
    completeTour()
  }, [close, completeTour])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        completeTour()
      } else if (e.key === 'ArrowRight' && currentStep < 3) {
        handleNext()
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        setCurrentStep((prev) => prev - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, handleNext, close, completeTour])

  useEffect(() => {
    if (!hasSeenTour && isLoading === false) {
      const timer = setTimeout(() => {
        open()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [hasSeenTour, isLoading, open])

  if (isLoading || hasSeenTour || !isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-label="新手引导">
      <div className="absolute inset-0 bg-[var(--bg-primary)]/90 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg mx-4 p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-2xl">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="跳过引导"
        >
          ✕
        </button>

        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <LanternDecoration size="lg" className="animate-float" />
        </div>

        <div className="mt-12 min-h-[280px] flex flex-col justify-center">
          {currentStep === 0 && <StepWelcome />}
          {currentStep === 1 && <StepGames />}
          {currentStep === 2 && <StepShortcuts />}
          {currentStep === 3 && <StepComplete />}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <ProgressIndicator current={currentStep} total={4} />
          <button
            onClick={handleNext}
            className="px-8 py-2 rounded-lg bg-[var(--accent-copper)] text-[var(--bg-primary)] font-medium hover:opacity-90 transition-opacity"
          >
            {currentStep === 3 ? '开始游戏' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  )
}
