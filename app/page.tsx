import Link from 'next/link'
import GameGrid from '@/components/GameGrid'
import FavoritesSection from '@/components/FavoritesSection'
import ScrollReveal from '@/components/ScrollReveal'
import StatsSection from '@/components/StatsSection'
import ScrollToTop from '@/components/ScrollToTop'
import ErrorBoundary from '@/components/ErrorBoundary'

function LanternIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 灯笼顶 */}
      <rect x="15" y="2" width="10" height="3" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="17" y="0" width="6" height="2" rx="1" fill="currentColor" opacity="0.4" />

      {/* 灯笼主体 */}
      <path
        d="M12 8 C8 8 6 14 6 20 L6 40 C6 46 10 50 14 50 L26 50 C30 50 34 46 34 40 L34 20 C34 14 32 8 28 8 L12 8Z"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="0.5"
      />

      {/* 灯笼纹路 */}
      <line x1="12" y1="15" x2="28" y2="15" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
      <line x1="10" y1="25" x2="30" y2="25" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
      <line x1="9" y1="35" x2="31" y2="35" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />

      {/* 灯笼底部 */}
      <circle cx="20" cy="52" r="2" fill="currentColor" opacity="0.4" />
      <line x1="20" y1="54" x2="20" y2="58" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  )
}

function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in stagger-6">
      <span className="text-[var(--text-muted)] text-[10px] tracking-widest uppercase">向下</span>
      <div className="w-px h-8 bg-gradient-to-b from-[var(--accent-copper)] to-transparent opacity-40" />
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section - 古典客栈意境 */}
      <section className="relative py-24 md:py-40 px-4 text-center overflow-hidden">
        {/* 宣纸纹理背景 */}
        <div className="absolute inset-0 paper-texture opacity-20" aria-hidden="true" />

        {/* 左侧大灯笼装饰 */}
        <div
          className="absolute left-8 top-1/4 opacity-20 animate-lantern-glow"
          aria-hidden="true"
          style={{ animationDuration: '4s' }}
        >
          <LanternIcon className="w-12 h-20 text-[var(--accent-copper)]" />
        </div>

        {/* 右侧灯笼装饰 */}
        <div
          className="absolute right-12 top-1/3 opacity-15 animate-lantern-glow"
          style={{ animationDuration: '5s', animationDelay: '2s' }}
          aria-hidden="true"
        >
          <LanternIcon className="w-8 h-14 text-[var(--accent-silver)]" />
        </div>

        {/* 顶部灯笼光晕 */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 animate-lantern-glow"
          style={{ animationDuration: '6s' }}
          aria-hidden="true"
        >
          <div
            className="w-full h-full"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(184,149,110,0.12) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />
        </div>

        {/* 墨点装饰 */}
        <div className="absolute top-32 left-1/4" aria-hidden="true">
          <div className="ink-dot" style={{ width: 4, height: 4 }} />
        </div>
        <div className="absolute top-48 right-1/3" aria-hidden="true">
          <div className="ink-dot opacity-50" style={{ width: 3, height: 3 }} />
        </div>
        <div className="absolute bottom-24 left-1/3" aria-hidden="true">
          <div className="ink-dot opacity-30" style={{ width: 5, height: 5 }} />
        </div>

        <div className="max-w-3xl mx-auto relative">
          {/* 主标题 */}
          <h1
            className="font-serif text-6xl md:text-7xl lg:text-8xl text-[var(--accent-silver)] animate-fade-in-up"
            style={{
              fontFamily: 'var(--font-serif), Noto Serif SC, serif',
              letterSpacing: '0.15em',
              textShadow: '0 0 80px rgba(201,197,192,0.25), 0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            银古客栈
          </h1>

          {/* 副标题 */}
          <p
            className="text-[var(--accent-copper)] text-xs md:text-sm mt-6 tracking-[0.5em] uppercase animate-fade-in-up stagger-2"
          >
            Silver Ancient Inn
          </p>

          {/* 墨线分隔 */}
          <div className="mt-10 flex justify-center animate-fade-in stagger-3">
            <div className="ink-divider w-40" />
          </div>

          {/* 标语 */}
          <p
            className="text-[var(--text-secondary)] text-lg md:text-xl mt-10 italic animate-fade-in-up stagger-4"
            style={{ fontFamily: 'var(--font-serif), Noto Serif SC, serif' }}
          >
            旅人的游戏驿站
          </p>

          {/* 装饰性小字 */}
          <p className="text-[var(--text-muted)] text-xs mt-5 tracking-[0.4em] animate-fade-in stagger-5">
            穿越迷雾，遇见珍藏
          </p>
        </div>

        <ScrollIndicator />
      </section>

      {/* Games Display Section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        {/* 区域标题 - 左侧对齐 */}
        <div className="flex items-center gap-4 mb-12">
          <div className="ink-dot" />
          <h2 className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.25em]">
            珍藏展品
          </h2>
          <div className="flex-1 ink-divider ml-2" />
        </div>

        <FavoritesSection />
        <ScrollReveal>
          <ErrorBoundary>
            <div className="mt-12">
              <GameGrid />
            </div>
          </ErrorBoundary>
        </ScrollReveal>
      </section>

      {/* Stats & Achievements Section */}
      <StatsSection />

      <ScrollToTop />

      {/* Footer - 简约雅致 */}
      <ScrollReveal>
        <footer className="py-24 mt-16 relative">
          {/* 顶部装饰 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48">
            <div className="ink-divider" />
          </div>

          {/* 底部灯笼 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-15" aria-hidden="true">
            <LanternIcon className="w-6 h-10 text-[var(--accent-copper)]" />
          </div>

          <div className="max-w-3xl mx-auto px-4">
            {/* 页脚文字 */}
            <div className="text-center space-y-3">
              <p
                className="text-[var(--accent-silver)] text-base tracking-[0.3em]"
                style={{ fontFamily: 'var(--font-serif), Noto Serif SC, serif' }}
              >
                银古客栈
              </p>

              <p className="text-[var(--text-muted)] text-[11px] tracking-wider">
                © {new Date().getFullYear()} · 保留所有权利
              </p>

              <p className="text-[var(--text-secondary)] text-[11px]">
                openginko.tech
              </p>
            </div>

            {/* 底部装饰 */}
            <div className="flex justify-center items-center gap-3 mt-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--border-default)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-copper)] opacity-40" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--border-default)]" />
            </div>
          </div>
        </footer>
      </ScrollReveal>
    </div>
  )
}
