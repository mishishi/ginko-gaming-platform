'use client'

import { Game } from '@/lib/games'

interface GameScreenshotProps {
  game: Game
}

export function IdolScreenshot({ game }: GameScreenshotProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Card collection background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a14] via-[#2d1024] to-[#1a0a14]" />

      {/* Decorative elements */}
      <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-xl" />
      <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full bg-gradient-to-tl from-pink-500/10 to-transparent blur-2xl" />

      {/* Card stack */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Back cards */}
        <div className="absolute w-32 h-44 rounded-xl bg-gradient-to-br from-pink-900/40 to-purple-900/40 border border-pink-500/20 transform rotate-[-12deg] translate-x-[-40px]" />
        <div className="absolute w-32 h-44 rounded-xl bg-gradient-to-br from-pink-800/50 to-purple-800/50 border border-pink-400/30 transform rotate-[-6deg] translate-x-[-20px]" />

        {/* Main card */}
        <div className="relative w-36 h-48 rounded-xl overflow-hidden shadow-2xl" style={{ boxShadow: '0 0 40px rgba(255,158,207,0.3)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d1024] to-[#1a0a14]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Idol silhouette */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-24">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <circle cx="50" cy="30" r="18" fill="url(#idolGradient)" />
              <path d="M25 85 Q50 60 75 85" fill="url(#idolGradient)" />
              <defs>
                <linearGradient id="idolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff9ecf" />
                  <stop offset="100%" stopColor="#ff6ba8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Card info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="text-[10px] text-pink-300/60 mb-1">SSR</div>
            <div className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-serif), serif' }}>樱庭若兰</div>
            <div className="text-[9px] text-pink-300/80"> Vocal ⭐⭐⭐⭐⭐</div>
          </div>

          {/* Sparkles */}
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-300 animate-ping" />
          <div className="absolute top-6 left-3 w-1.5 h-1.5 rounded-full bg-pink-200 animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Front cards */}
        <div className="absolute w-32 h-44 rounded-xl bg-gradient-to-br from-pink-700/50 to-purple-700/50 border border-pink-400/30 transform rotate-[4deg] translate-x-[20px]" />
        <div className="absolute w-32 h-44 rounded-xl bg-gradient-to-br from-pink-600/60 to-purple-600/60 border border-pink-300/40 transform rotate-[10deg] translate-x-[40px]" />
      </div>

      {/* Stars decoration */}
      <div className="absolute top-6 right-6 text-pink-400/60 text-xs">★ ×12</div>
    </div>
  )
}

export function QuizScreenshot({ game }: GameScreenshotProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050f1a] via-[#0a2535] to-[#050f1a]" />

      {/* Glowing orb background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,245,255,0.15) 0%, transparent 70%)',
          filter: 'blur(20px)'
        }}
      />

      {/* Decorative circles */}
      <div className="absolute top-8 right-8 w-20 h-20 rounded-full border border-cyan-500/20" />
      <div className="absolute bottom-12 left-6 w-12 h-12 rounded-full border border-cyan-500/10" />

      {/* Knowledge symbol floating elements */}
      <div className="absolute top-12 left-1/4 text-cyan-500/30 text-2xl animate-pulse">✦</div>
      <div className="absolute top-20 right-1/4 text-cyan-400/20 text-lg animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
      <div className="absolute bottom-24 right-1/3 text-cyan-500/25 text-sm animate-pulse" style={{ animationDelay: '1s' }}>✦</div>

      {/* Central brain/lightbulb symbol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Glow behind */}
          <div className="absolute inset-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl" />

          {/* Brain icon with circuit pattern */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400/80">
              <defs>
                <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f5ff" />
                  <stop offset="100%" stopColor="#0088aa" />
                </linearGradient>
              </defs>
              {/* Brain outline */}
              <path
                d="M50 15 C25 15 15 35 15 50 C15 65 25 80 35 85 C40 87 45 88 50 88 C55 88 60 87 65 85 C75 80 85 65 85 50 C85 35 75 15 50 15"
                fill="none"
                stroke="url(#brainGrad)"
                strokeWidth="1.5"
              />
              {/* Brain folds */}
              <path d="M30 45 Q40 35 50 45 Q60 55 70 45" fill="none" stroke="url(#brainGrad)" strokeWidth="1" opacity="0.6" />
              <path d="M28 55 Q40 45 50 55 Q60 65 72 55" fill="none" stroke="url(#brainGrad)" strokeWidth="1" opacity="0.6" />
              <path d="M35 70 Q45 60 50 70 Q55 80 65 72" fill="none" stroke="url(#brainGrad)" strokeWidth="1" opacity="0.6" />
              {/* Center spark */}
              <circle cx="50" cy="50" r="8" fill="none" stroke="url(#brainGrad)" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="3" fill="#00f5ff" opacity="0.8" />
              {/* Circuit lines from brain */}
              <line x1="50" y1="42" x2="50" y2="30" stroke="url(#brainGrad)" strokeWidth="1" opacity="0.4" />
              <line x1="58" y1="50" x2="70" y2="50" stroke="url(#brainGrad)" strokeWidth="1" opacity="0.4" />
              <line x1="50" y1="58" x2="50" y2="70" stroke="url(#brainGrad)" strokeWidth="1" opacity="0.4" />
              <line x1="42" y1="50" x2="30" y2="50" stroke="url(#brainGrad)" strokeWidth="1" opacity="0.4" />
              {/* Small nodes */}
              <circle cx="50" cy="30" r="2" fill="#00f5ff" opacity="0.5" />
              <circle cx="70" cy="50" r="2" fill="#00f5ff" opacity="0.5" />
              <circle cx="50" cy="70" r="2" fill="#00f5ff" opacity="0.5" />
              <circle cx="30" cy="50" r="2" fill="#00f5ff" opacity="0.5" />
            </svg>

            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping" />
            <div className="absolute inset-4 rounded-full border border-cyan-400/10 animate-ping" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>

      {/* Score display at top */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-6">
        <div className="text-center">
          <div className="text-cyan-400/60 text-[10px]">玩家一</div>
          <div className="text-white text-xl font-bold">7</div>
        </div>
        <div className="px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10">
          <span className="text-cyan-300 text-xs font-medium">VS</span>
        </div>
        <div className="text-center">
          <div className="text-cyan-400/60 text-[10px]">玩家二</div>
          <div className="text-white text-xl font-bold">5</div>
        </div>
      </div>

      {/* Question card at bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4/5 max-w-sm">
        <div className="relative">
          {/* Card glow */}
          <div className="absolute -inset-1 bg-cyan-500/20 rounded-xl blur-sm" />

          <div className="relative bg-[#0a2535]/90 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-sm">
            {/* Question number */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">第 12 题</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">文学</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-400/60">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <span className="text-[10px]">08</span>
              </div>
            </div>

            {/* Question text */}
            <div className="text-white/90 text-sm text-center mb-3">
              「床前明月光，疑是地上霜」出自哪位诗人？
            </div>

            {/* Answer options */}
            <div className="flex justify-center gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-cyan-500/30 text-cyan-200 text-xs border border-cyan-400/30">李白</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs border border-white/10">杜甫</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs border border-white/10">白居易</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-500/30 rounded-tl" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-500/30 rounded-tr" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-500/30 rounded-bl" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-500/30 rounded-br" />
    </div>
  )
}

export function FateScreenshot({ game }: GameScreenshotProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#12100a] via-[#1a1610] to-[#12100a]" />

      {/* Mystical particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-amber-400/30 animate-ping" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-amber-300/20 animate-ping" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 left-1/2 w-1 h-1 rounded-full bg-amber-500/40 animate-ping" style={{ animationDelay: '2s' }} />

      {/* Divination circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-amber-500/30"
            style={{ boxShadow: '0 0 30px rgba(184,148,95,0.2), inset 0 0 30px rgba(184,148,95,0.1)' }} />

          {/* Inner rings */}
          <div className="absolute inset-4 rounded-full border border-amber-400/20" />
          <div className="absolute inset-8 rounded-full border border-amber-300/10" />

          {/* Zodiac symbols */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-amber-500/40 text-xs">♈</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-amber-500/40 text-xs">♎</div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 text-amber-500/40 text-xs">♌</div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 text-amber-500/40 text-xs">♉</div>

          {/* Center symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600/20 to-amber-900/20 border border-amber-500/30 flex items-center justify-center"
              style={{ boxShadow: '0 0 20px rgba(184,148,95,0.2)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-400/60">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          {/* Floating particles */}
          <div className="absolute -top-2 left-1/2 w-1 h-1 rounded-full bg-amber-300 animate-ping" />
          <div className="absolute -bottom-2 left-1/2 w-1 h-1 rounded-full bg-amber-400 animate-ping" style={{ animationDelay: '0.7s' }} />
        </div>
      </div>

      {/* Fortune text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <div className="text-amber-500/60 text-xs mb-1">今日运势</div>
        <div className="text-amber-300 text-lg" style={{ fontFamily: 'var(--font-serif), serif' }}>命运指引中...</div>
      </div>
    </div>
  )
}

export default function GameScreenshot({ game }: GameScreenshotProps) {
  if (game.slug === 'idol') return <IdolScreenshot game={game} />
  if (game.slug === 'quiz') return <QuizScreenshot game={game} />
  if (game.slug === 'fate') return <FateScreenshot game={game} />
  return null
}
