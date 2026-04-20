'use client'

interface SkeletonProps {
  color?: string
  glowColor?: string
}

export default function Skeleton({ color = '#d4a574', glowColor = '#d4a574' }: SkeletonProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)] z-20 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor}30 0%, transparent 50%)`,
        }}
      />

      {/* Skeleton card */}
      <div className="relative w-80 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] overflow-hidden">
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
          }}
        />

        {/* Content skeleton */}
        <div className="space-y-4 mt-2">
          {/* Title bar */}
          <div className="h-8 rounded-lg bg-[var(--bg-elevated)] relative overflow-hidden">
            <div
              className="absolute inset-0 Skeleton-shimmer"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${color}20 50%, transparent 100%)`,
              }}
            />
          </div>

          {/* Subtitle bar */}
          <div className="h-4 w-32 rounded bg-[var(--bg-elevated)] relative overflow-hidden">
            <div
              className="absolute inset-0 Skeleton-shimmer"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${color}15 50%, transparent 100%)`,
              }}
            />
          </div>

          {/* Description lines */}
          <div className="space-y-2 pt-2">
            <div className="h-3 rounded bg-[var(--bg-elevated)] relative overflow-hidden">
              <div
                className="absolute inset-0 Skeleton-shimmer"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${color}10 50%, transparent 100%)`,
                }}
              />
            </div>
            <div className="h-3 rounded bg-[var(--bg-elevated)] w-4/5 relative overflow-hidden">
              <div
                className="absolute inset-0 Skeleton-shimmer"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${color}10 50%, transparent 100%)`,
                }}
              />
            </div>
            <div className="h-3 rounded bg-[var(--bg-elevated)] w-3/5 relative overflow-hidden">
              <div
                className="absolute inset-0 Skeleton-shimmer"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${color}10 50%, transparent 100%)`,
                }}
              />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="h-10 rounded-lg mt-6 bg-[var(--bg-elevated)] relative overflow-hidden">
            <div
              className="absolute inset-0 Skeleton-shimmer"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${color}20 50%, transparent 100%)`,
              }}
            />
          </div>
        </div>

        {/* Center loading indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="px-4 py-2 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${color}15`,
              color: color,
              border: `1px solid ${color}30`,
            }}
          >
            正在召唤游戏...
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
