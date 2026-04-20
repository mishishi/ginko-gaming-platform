'use client'

interface HomepageSkeletonProps {
  theme?: string
}

function SkeletonCard({ theme }: HomepageSkeletonProps) {
  const color = theme === 'idol' ? '#ff9ecf' : theme === 'quiz' ? '#00f5ff' : '#b8945f'

  return (
    <div className="relative bg-[var(--bg-card)] rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      {/* Noise overlay */}
      <div className="noise-overlay rounded-2xl" aria-hidden="true" />

      {/* Screenshot area skeleton */}
      <div className="h-36 w-full relative overflow-hidden bg-[var(--bg-elevated)]">
        <div
          className="absolute inset-0 Skeleton-shimmer"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${color}15 50%, transparent 100%)`,
          }}
        />
      </div>

      {/* Top color glow bar */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
        }}
      />

      {/* Card content skeleton */}
      <div className="p-6 space-y-3">
        {/* Metadata row */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-16 rounded bg-[var(--bg-elevated)] relative overflow-hidden">
            <div className="absolute inset-0 Skeleton-shimmer" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}10 50%, transparent 100%)` }} />
          </div>
          <div className="h-3 w-8 rounded bg-[var(--bg-elevated)] relative overflow-hidden">
            <div className="absolute inset-0 Skeleton-shimmer" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}10 50%, transparent 100%)` }} />
          </div>
        </div>

        {/* Title */}
        <div className="h-8 w-32 rounded-lg bg-[var(--bg-elevated)] relative overflow-hidden">
          <div
            className="absolute inset-0 Skeleton-shimmer"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${color}15 50%, transparent 100%)`,
            }}
          />
        </div>

        {/* Subtitle */}
        <div className="h-4 w-40 rounded bg-[var(--bg-elevated)] relative overflow-hidden">
          <div className="absolute inset-0 Skeleton-shimmer" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}10 50%, transparent 100%)` }} />
        </div>

        {/* Description lines */}
        <div className="space-y-2 pt-1">
          <div className="h-3 rounded bg-[var(--bg-elevated)] w-full relative overflow-hidden">
            <div className="absolute inset-0 Skeleton-shimmer" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}10 50%, transparent 100%)` }} />
          </div>
          <div className="h-3 rounded bg-[var(--bg-elevated)] w-4/5 relative overflow-hidden">
            <div className="absolute inset-0 Skeleton-shimmer" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}10 50%, transparent 100%)` }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes Skeleton-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .Skeleton-shimmer {
          animation: Skeleton-shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default function HomepageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-60">
      <SkeletonCard theme="idol" />
      <SkeletonCard theme="quiz" />
      <SkeletonCard theme="fate" />
    </div>
  )
}
