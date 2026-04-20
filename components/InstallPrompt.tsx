'use client';

import { useState, useEffect, useRef } from 'react';

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      const dismissed = localStorage.getItem('installPromptDismissed');
      if (!dismissed) {
        setVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPromptRef.current) return;
    deferredPromptRef.current.prompt();
    const { outcome } = await deferredPromptRef.current.userChoice;
    if (outcome === 'accepted') {
      deferredPromptRef.current = null;
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('installPromptDismissed', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <svg
          className="install-prompt-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <p className="install-prompt-text">Install app for a better experience</p>
        <button onClick={handleInstall} className="install-btn">
          安装
        </button>
        <button onClick={handleDismiss} className="dismiss-btn">
          暂不
        </button>
      </div>

      <style jsx>{`
        .install-prompt {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .install-prompt-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(245, 158, 11, 0.1);
        }

        .install-prompt-icon {
          width: 20px;
          height: 20px;
          color: #f59e0b;
          flex-shrink: 0;
        }

        .install-prompt-text {
          margin: 0;
          font-size: 14px;
          color: #e5e5e5;
          white-space: nowrap;
        }

        .install-btn {
          padding: 6px 16px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border: none;
          border-radius: 6px;
          color: #1a1a2e;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .install-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }

        .install-btn:active {
          transform: scale(0.98);
        }

        .dismiss-btn {
          padding: 6px 12px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: #a3a3a3;
          font-size: 13px;
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease;
        }

        .dismiss-btn:hover {
          border-color: rgba(255, 255, 255, 0.4);
          color: #d4d4d4;
        }

        @media (max-width: 480px) {
          .install-prompt-content {
            padding: 10px 12px;
            gap: 8px;
          }

          .install-prompt-text {
            font-size: 13px;
            max-width: 120px;
            white-space: normal;
          }
        }
      `}</style>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
