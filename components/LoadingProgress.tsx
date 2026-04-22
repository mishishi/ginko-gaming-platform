'use client'

interface LoadingProgressProps {
  progress: number
  color: string
  glowColor: string
}

export default function LoadingProgress({ progress, color, glowColor }: LoadingProgressProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-40 h-0.5 bg-[var(--bg-elevated)]">
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${Math.min(progress, 100)}%`,
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          boxShadow: `0 0 8px ${glowColor}`,
        }}
      />
    </div>
  )
}
