export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Mini nav bar skeleton */}
      <div className="h-12 flex items-center px-4 border-b border-[var(--bg-card)] bg-[var(--bg-primary)]/90 backdrop-blur-sm">
        <div className="w-20 h-4 bg-[var(--bg-card)] rounded animate-pulse" />
        <div className="flex-1 flex justify-center">
          <div className="w-32 h-4 bg-[var(--bg-card)] rounded animate-pulse" />
        </div>
        <div className="w-20" />
      </div>

      {/* Metadata bar skeleton */}
      <div className="flex items-center justify-center gap-5 py-3 border-b border-[var(--bg-card)] bg-[var(--bg-primary)]/30">
        <div className="w-24 h-4 bg-[var(--bg-card)] rounded animate-pulse" />
        <div className="w-px h-3 bg-[var(--bg-card)]" />
        <div className="w-20 h-4 bg-[var(--bg-card)] rounded animate-pulse" />
        <div className="w-px h-3 bg-[var(--bg-card)]" />
        <div className="w-16 h-4 bg-[var(--bg-card)] rounded animate-pulse" />
      </div>

      {/* Game area skeleton */}
      <div className="w-full h-[calc(100vh-7rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-64 h-80 rounded-xl bg-[var(--bg-card)] animate-pulse"
            style={{
              boxShadow: '0 0 60px rgba(184, 149, 110, 0.1)',
            }}
          />
          <div className="w-32 h-4 bg-[var(--bg-card)] rounded animate-pulse mt-4" />
          <div className="w-48 h-3 bg-[var(--bg-card)] rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
