import Link from 'next/link'
import GameGrid from '@/components/GameGrid'

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section - 简约优雅 */}
      <section className="relative py-16 md:py-24 px-4 text-center overflow-hidden">
        {/* 淡墨背景 */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(184,149,110,0.06) 0%, transparent 60%)',
          }}
        />

        {/* 装饰性墨点 */}
        <div className="absolute top-20 left-1/4 opacity-20" aria-hidden="true">
          <div className="w-1 h-1 rounded-full bg-[var(--accent-copper)]" />
        </div>
        <div className="absolute top-32 right-1/3 opacity-15" aria-hidden="true">
          <div className="w-0.5 h-0.5 rounded-full bg-[var(--accent-silver)]" />
        </div>

        <div className="max-w-3xl mx-auto relative">
          {/* 主标题 */}
          <h1
            className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--accent-silver)] animate-fade-in-up"
            style={{
              fontFamily: 'var(--font-serif), Noto Serif SC, serif',
              letterSpacing: '0.08em',
            }}
          >
            银古客栈
          </h1>

          {/* 副标题 - 铜色 */}
          <p
            className="text-[var(--accent-copper)] text-sm md:text-base mt-4 tracking-[0.3em] uppercase animate-fade-in-up stagger-2"
          >
            Silver Ancient Inn
          </p>

          {/* 简洁分隔线 */}
          <div className="mt-8 flex justify-center animate-fade-in stagger-3">
            <div className="ink-divider w-24" />
          </div>

          {/* 标语 */}
          <p
            className="text-[var(--text-secondary)] text-base md:text-lg mt-6 italic animate-fade-in-up stagger-4"
            style={{ fontFamily: 'var(--font-serif), Noto Serif SC, serif' }}
          >
            旅人的游戏驿站
          </p>

          {/* 装饰性小字 */}
          <p className="text-[var(--text-muted)] text-xs mt-3 tracking-widest animate-fade-in stagger-5">
            穿越迷雾，遇见珍藏
          </p>
        </div>
      </section>

      {/* Games Display Section */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        {/* 区域标题 */}
        <div className="flex items-center gap-4 mb-10">
          <div className="ink-dot" />
          <h2 className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em]">
            珍藏展品
          </h2>
          <div className="flex-1 ink-divider" />
        </div>

        <GameGrid />
      </section>

      {/* Footer - 简约雅致 */}
      <footer className="py-20 mt-8 relative">
        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32">
          <div className="ink-divider" />
        </div>

        <div className="max-w-3xl mx-auto px-4">
          {/* 页脚文字 */}
          <div className="text-center space-y-4">
            <p
              className="text-[var(--accent-silver)] text-lg tracking-widest"
              style={{ fontFamily: 'var(--font-serif), Noto Serif SC, serif' }}
            >
              银古客栈
            </p>

            <p className="text-[var(--text-muted)] text-xs tracking-wider">
              © {new Date().getFullYear()} · 保留所有权利
            </p>

            <p className="text-[var(--text-muted)] text-xs">
              openginko.tech
            </p>
          </div>

          {/* 底部装饰 */}
          <div className="flex justify-center items-center gap-3 mt-10">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--border-default)]" />
            <div className="w-1 h-1 rounded-full bg-[var(--accent-copper)] opacity-50" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[var(--border-default)]" />
          </div>
        </div>
      </footer>
    </div>
  )
}
