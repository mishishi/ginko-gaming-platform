'use client';

import { useEffect, useState } from 'react';

export function ServiceWorkerRegistration() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Check for updates periodically
          const checkForUpdates = () => {
            registration.update();
          };

          // Initial check after 1 second
          const initialTimer = setTimeout(checkForUpdates, 1000);

          // Periodic check every 60 seconds
          const intervalId = setInterval(checkForUpdates, 60000);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                setUpdateAvailable(true);
              }
            });
          });

          return () => {
            clearTimeout(initialTimer);
            clearInterval(intervalId);
          };
        })
        .catch(() => {
          // Service Worker registration failed silently
        });
    }
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--accent-copper)] shadow-lg">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-copper)]/20 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-copper)" strokeWidth="2">
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path d="M12 8v4l3 3" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)]">有新版本可用</p>
          <p className="text-xs text-[var(--text-muted)]">刷新页面以获取最新版本</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium bg-[var(--accent-copper)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
        >
          刷新
        </button>
      </div>
    </div>
  );
}
