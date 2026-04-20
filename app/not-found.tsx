import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
          {/* Fog background effect */}
          <div className="fog-bg" />

          {/* Ambient glow effects */}
          <div
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(74, 92, 79, 0.08) 0%, transparent 70%)',
              animation: 'glow-breathe 4s ease-in-out infinite',
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(212, 165, 116, 0.06) 0%, transparent 70%)',
              animation: 'glow-breathe 4s ease-in-out infinite',
              animationDelay: '2s',
            }}
          />

          {/* Floating lantern decoration */}
          <div
            className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none opacity-20"
            style={{ animation: 'float 6s ease-in-out infinite' }}
            aria-hidden="true"
          >
            <svg width="32" height="42" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="24" cy="36" rx="10" ry="14" fill="var(--accent-amber)" />
              <rect x="19" y="18" width="10" height="6" rx="2" fill="var(--accent-amber)" opacity="0.7" />
              <rect x="22" y="12" width="4" height="6" rx="1" fill="var(--accent-amber)" opacity="0.5" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-4">
            {/* Stylized 404 with glow effect */}
            <div className="mb-8 animate-fade-in-up">
              <div className="relative inline-block">
                {/* Glow behind text */}
                <div
                  className="absolute inset-0 blur-3xl opacity-30"
                  style={{
                    background: 'radial-gradient(circle, var(--accent-amber) 0%, transparent 70%)',
                  }}
                />
                <span
                  className="text-[6rem] sm:text-[10rem] md:text-[14rem] leading-none font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-[var(--accent-amber)] to-[var(--accent-amber)] opacity-20 select-none"
                  style={{ fontFamily: 'var(--font-serif), Noto Serif SC, serif' }}
                >
                  404
                </span>
              </div>
            </div>

            {/* Main message */}
            <h1
              className="text-2xl md:text-3xl mb-4 animate-fade-in-up stagger-1"
              style={{
                fontFamily: 'var(--font-serif), Noto Serif SC, serif',
                color: 'var(--accent-amber)',
              }}
            >
              这个页面不存在
            </h1>

            {/* Sub message */}
            <p
              className="text-lg md:text-xl mb-12 animate-fade-in-up stagger-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              旅人，你走错路了
            </p>

            {/* Decorative separator */}
            <div className="flex justify-center items-center gap-4 mb-12 animate-fade-in stagger-3">
              <div
                className="w-16 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent, var(--accent-amber))',
                }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: 'var(--accent-amber)',
                  boxShadow: '0 0 8px var(--accent-amber)',
                }}
              />
              <div
                className="w-16 h-px"
                style={{
                  background: 'linear-gradient(90deg, var(--accent-amber), transparent)',
                }}
              />
            </div>

            {/* Back to home link */}
            <Link
              href="/"
              className="not-found-back-link inline-flex items-center gap-2 px-6 py-3 border rounded-lg transition-all duration-300 animate-fade-in-up stagger-4 hover:scale-105 active:scale-95"
              style={{
                color: 'var(--accent-amber)',
                borderColor: 'var(--accent-amber)',
                backgroundColor: 'transparent',
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              返回银古客栈
            </Link>
          </div>

          {/* Additional ambient particles */}
          <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full opacity-20" style={{ background: 'var(--accent-amber)', animation: 'float-particle 15s ease-in-out infinite' }} />
          <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 rounded-full opacity-15" style={{ background: 'var(--accent-green)', animation: 'float-particle 20s ease-in-out infinite', animationDelay: '5s' }} />
        </div>
      </body>
    </html>
  )
}
