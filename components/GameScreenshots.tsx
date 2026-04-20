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
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a1a] via-[#0d2424] to-[#0a1a1a]" />

      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.3) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* VS Layout */}
      <div className="absolute inset-0 flex items-center justify-center gap-8">
        {/* Player 1 */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400/50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-cyan-300">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="mt-2 text-cyan-300/80 text-xs">玩家一</div>
          <div className="text-xl font-bold text-white">7 分</div>
        </div>

        {/* VS Badge */}
        <div className="relative">
          <div className="absolute inset-0 w-12 h-12 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-12 h-12 rounded-full border-2 border-cyan-400/50 flex items-center justify-center">
            <span className="text-cyan-300 font-bold text-sm">VS</span>
          </div>
        </div>

        {/* Player 2 */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400/50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-cyan-300">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="mt-2 text-cyan-300/80 text-xs">玩家二</div>
          <div className="text-xl font-bold text-white">5 分</div>
        </div>
      </div>

      {/* Question area */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4/5 max-w-md">
        <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-4">
          <div className="text-cyan-400/60 text-[10px] mb-2">第 12 题 · 文学</div>
          <div className="text-white text-sm text-center">
            「床前明月光，疑是地上霜」出自哪位诗人？
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <span className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs">李白</span>
            <span className="px-3 py-1 rounded bg-white/5 text-white/60 text-xs">杜甫</span>
            <span className="px-3 py-1 rounded bg-white/5 text-white/60 text-xs">白居易</span>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-cyan-400/60">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
        <span className="text-cyan-400/80 text-xs">08</span>
      </div>
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
