'use client'

import { useRouter } from 'next/navigation'

export default function OfflineGameModal() {
  const router = useRouter()
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-label="网络不可用">
      <div className="absolute inset-0 bg-[var(--bg-primary)]/90 backdrop-blur-sm" />
      <div className="relative p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-2xl text-center max-w-sm">
        <div className="text-4xl mb-4" aria-hidden="true">📡</div>
        <h3 className="text-xl text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-serif), serif' }}>
          网络不可用
        </h3>
        <p className="text-[var(--text-secondary)] text-sm mb-4">
          请检查网络连接后重试
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 rounded-lg bg-[var(--accent-copper)] text-[var(--bg-primary)] font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent-copper)]"
        >
          返回首页
        </button>
      </div>
    </div>
  )
}
