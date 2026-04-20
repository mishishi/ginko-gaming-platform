import Link from 'next/link'
import GameCard from '@/components/GameCard'
import { games } from '@/lib/games'

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 text-center overflow-hidden">
        {/* Large ambient lantern glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,165,116,0.12) 0%, rgba(212,165,116,0.06) 30%, transparent 70%)',
              animation: 'glow-breathe 4s ease-in-out infinite',
            }}
          />
        </div>

        {/* Floating lantern - larger and more prominent */}
        <div
          className="absolute top-8 md:top-16 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ animation: 'float 6s ease-in-out infinite' }}
          aria-hidden="true"
        >
          {/* Lantern glow */}
          <div
            className="absolute inset-0 w-20 h-20 -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,165,116,0.4) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
          <svg
            width="48"
            height="64"
            viewBox="0 0 48 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Lantern body */}
            <ellipse cx="24" cy="36" rx="12" ry="16" fill="var(--accent-amber)" opacity="0.9" />
            {/* Lantern cap */}
            <rect x="18" y="16" width="12" height="8" rx="2" fill="var(--accent-amber)" opacity="0.7" />
            {/* Lantern top */}
            <rect x="22" y="10" width="4" height="6" rx="1" fill="var(--accent-amber)" opacity="0.5" />
            {/* String */}
            <line x1="24" y1="4" x2="24" y2="10" stroke="var(--accent-amber)" strokeWidth="1.5" opacity="0.5" />
            {/* Inner glow */}
            <ellipse cx="24" cy="36" rx="6" ry="8" fill="white" opacity="0.2" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Main title - dramatic and bold */}
          <h1
            className="font-serif text-7xl md:text-[8rem] leading-none text-[var(--accent-amber)] animate-fade-in-up"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              textShadow: `
                0 0 80px rgba(212,165,116,0.6),
                0 0 160px rgba(212,165,116,0.4),
                0 0 240px rgba(212,165,116,0.2)
              `,
              letterSpacing: '0.02em',
            }}
          >
            银古客栈
          </h1>

          {/* Tagline - clearly secondary */}
          <p className="text-[var(--text-secondary)] text-lg md:text-xl mt-6 animate-fade-in-up stagger-2 tracking-[0.2em]">
            旅人的游戏驿站
          </p>

          {/* Decorative separator */}
          <div className="mt-8 flex justify-center animate-fade-in stagger-3">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[var(--accent-amber)]/40 to-transparent" />
          </div>

          {/* Poetic description - tertiary */}
          <p
            className="text-[var(--text-muted)] text-sm mt-6 italic animate-fade-in-up stagger-4"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            穿越迷雾，遇见珍藏
          </p>
        </div>
      </section>

      {/* Games Display Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-center text-[var(--text-secondary)] text-sm uppercase tracking-widest mb-12 animate-fade-in stagger-5">
          珍藏展品
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <GameCard key={game.slug} game={game} index={index} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 mt-auto border-t border-[#1a1f24]">
        <div className="max-w-4xl mx-auto px-4">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Brand column */}
            <div className="text-center md:text-left">
              {/* Decorative element */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-px"
                  style={{
                    background: 'linear-gradient(90deg, var(--accent-amber), transparent)',
                  }}
                />
                <h3
                  className="text-xl text-[var(--accent-amber)]"
                  style={{ fontFamily: "'Noto Serif SC', serif" }}
                >
                  银古客栈
                </h3>
                <div
                  className="w-8 h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent, var(--accent-amber))',
                  }}
                />
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                穿越迷雾，遇见珍藏<br />
                每一个游戏，都是一段旅程
              </p>
            </div>

            {/* Quick links with underline hover */}
            <div className="text-center">
              <h4 className="text-[var(--text-primary)] text-sm font-medium mb-4">快速导航</h4>
              <div className="flex flex-col gap-3">
                <Link
                  href="/games/idol"
                  className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-amber)] transition-all duration-300 inline-block relative group"
                >
                  偶像收藏
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--accent-amber)] transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link
                  href="/games/quiz"
                  className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-amber)] transition-all duration-300 inline-block relative group"
                >
                  知识竞技
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--accent-amber)] transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link
                  href="/games/fate"
                  className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-amber)] transition-all duration-300 inline-block relative group"
                >
                  命运占卜
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--accent-amber)] transition-all duration-300 group-hover:w-full" />
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div className="text-center md:text-right">
              <h4 className="text-[var(--text-primary)] text-sm font-medium mb-4">联系我们</h4>
              <div className="flex flex-col gap-2 text-[var(--text-secondary)] text-sm">
                <span>openginko.tech</span>
                <span>银古客栈 · {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* Decorative line */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[var(--accent-amber)]/30 to-transparent" />
          </div>

          {/* Copyright - subtle and elegant */}
          <p className="text-center text-[var(--text-muted)] text-[11px] tracking-wide">
            © {new Date().getFullYear()} 银古客栈 · 保留所有权利
          </p>
        </div>
      </footer>
    </div>
  )
}
