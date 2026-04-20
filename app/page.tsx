import Link from 'next/link'
import GameCard from '@/components/GameCard'
import { games } from '@/lib/games'

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        {/* Floating lantern */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 animate-float opacity-20 pointer-events-none">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="12" cy="14" rx="5" ry="7" fill="var(--accent-amber)" opacity="0.6" />
            <rect x="10" y="5" width="4" height="3" rx="1" fill="var(--accent-amber)" />
            <line x1="12" y1="3" x2="12" y2="5" stroke="var(--accent-amber)" strokeWidth="1" />
          </svg>
        </div>

        {/* Lantern glow pulse */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-48 h-48 rounded-full animate-lantern-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(212,165,116,0.15) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto relative">
          <h1
            className="font-serif text-5xl md:text-6xl text-[var(--accent-amber)] mb-4 animate-fade-in-up"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            银古客栈
          </h1>
          <p className="text-[var(--text-secondary)] text-lg md:text-xl animate-fade-in-up stagger-2">
            旅人的游戏驿站
          </p>
          {/* Poetic description */}
          <p
            className="text-[var(--text-muted)] text-sm mt-3 italic animate-fade-in-up stagger-3"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            穿越迷雾，遇见珍藏
          </p>
        </div>

        {/* Decorative line */}
        <div className="mt-8 flex justify-center animate-fade-in stagger-4">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[var(--accent-amber)] to-transparent opacity-50" />
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
              <h3
                className="text-xl text-[var(--accent-amber)] mb-2"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              >
                银古客栈
              </h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                穿越迷雾，遇见珍藏<br />
                每一个游戏，都是一段旅程
              </p>
            </div>

            {/* Quick links */}
            <div className="text-center">
              <h4 className="text-[var(--text-primary)] text-sm font-medium mb-4">快速导航</h4>
              <div className="flex flex-col gap-2">
                <Link href="/games/idol" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-amber)] transition-colors duration-300">
                  偶像收藏
                </Link>
                <Link href="/games/quiz" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-amber)] transition-colors duration-300">
                  知识竞技
                </Link>
                <Link href="/games/fate" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-amber)] transition-colors duration-300">
                  命运占卜
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

          {/* Copyright */}
          <p className="text-center text-[var(--text-muted)] text-xs">
            © {new Date().getFullYear()} 银古客栈 · 保留所有权利
          </p>
        </div>
      </footer>
    </div>
  )
}
