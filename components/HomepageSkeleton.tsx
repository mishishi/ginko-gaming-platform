'use client'

interface HomepageSkeletonProps {
  theme?: string
}

function SkeletonCard({ theme }: HomepageSkeletonProps) {
  const color = theme === 'idol' ? '#e8b4c8' : theme === 'quiz' ? '#a8d8d8' : '#b8956e'

  return (
    <div className="relative bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)] overflow-hidden">
      {/* Top accent line */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color}50 50%, transparent 100%)`,
        }}
      />

      {/* Screenshot area skeleton */}
      <div className="h-32 w-full relative overflow-hidden bg-[var(--bg-elevated)]">
        <div
          className="absolute inset-0 skeleton-shimmer"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${color}10 50%, transparent 100%)`,
          }}
        />
      </div>

      {/* Card content skeleton */}
      <div className="p-4 space-y-3">
        {/* Metadata row */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-12 rounded bg-[var(--bg-elevated)] relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}08 50%, transparent 100%)` }} />
          </div>
          <div className="h-3 w-6 rounded bg-[var(--bg-elevated)] relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}08 50%, transparent 100%)` }} />
          </div>
        </div>

        {/* Title */}
        <div className="h-7 w-28 rounded bg-[var(--bg-elevated)] relative overflow-hidden">
          <div
            className="absolute inset-0 skeleton-shimmer"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${color}12 50%, transparent 100%)`,
            }}
          />
        </div>

        {/* Subtitle */}
        <div className="h-3 w-32 rounded bg-[var(--bg-elevated)] relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}08 50%, transparent 100%)` }} />
        </div>

        {/* Description lines */}
        <div className="space-y-2 pt-1">
          <div className="h-3 rounded bg-[var(--bg-elevated)] w-full relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}08 50%, transparent 100%)` }} />
          </div>
          <div className="h-3 rounded bg-[var(--bg-elevated)] w-4/5 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}08 50%, transparent 100%)` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomepageSkeleton() {
  return (
    <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
      <SkeletonCard theme="idol" />
      <SkeletonCard theme="quiz" />
      <SkeletonCard theme="fate" />
    </div>
  )
}
