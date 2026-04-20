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
            <ellipse cx="12" cy="14" rx="5" ry="7" fill="#d4a574" opacity="0.6" />
            <rect x="10" y="5" width="4" height="3" rx="1" fill="#d4a574" />
            <line x1="12" y1="3" x2="12" y2="5" stroke="#d4a574" strokeWidth="1" />
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
            className="font-serif text-5xl md:text-6xl text-[#d4a574] mb-4 animate-fade-in-up"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            银古客栈
          </h1>
          <p className="text-[#8a8680] text-lg md:text-xl animate-fade-in-up stagger-2">
            旅人的游戏驿站
          </p>
          {/* Poetic description */}
          <p
            className="text-[#6b6560] text-sm mt-3 italic animate-fade-in-up stagger-3"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            穿越迷雾，遇见珍藏
          </p>
        </div>

        {/* Decorative line */}
        <div className="mt-8 flex justify-center animate-fade-in stagger-4">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4a574] to-transparent opacity-50" />
        </div>
      </section>

      {/* Games Display Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-center text-[#8a8680] text-sm uppercase tracking-widest mb-12 animate-fade-in stagger-4">
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
          {/* Platform description */}
          <div className="text-center mb-8">
            <h3
              className="text-xl text-[#d4a574] mb-2"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              银古客栈
            </h3>
            <p className="text-[#8a8680] text-sm">
              穿越迷雾，遇见珍藏
            </p>
          </div>

          {/* Links */}
          <div className="flex justify-center gap-8 mb-8">
            <a
              href="#"
              className="text-[#8a8680] text-sm hover:text-[#d4a574] transition-colors duration-300"
            >
              关于
            </a>
            <a
              href="#"
              className="text-[#8a8680] text-sm hover:text-[#d4a574] transition-colors duration-300"
            >
              联系我们
            </a>
          </div>

          {/* Social links */}
          <div className="flex justify-center gap-4 mb-8">
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center text-[#8a8680] hover:text-[#d4a574] border border-[#1a1f24] rounded hover:border-[#d4a574]/30 transition-all duration-300"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                />
              </svg>
            </a>
          </div>

          {/* Decorative line */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4a574]/30 to-transparent" />
          </div>

          {/* Copyright */}
          <p className="text-center text-[#8a8680] text-xs">
            银古客栈 · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
