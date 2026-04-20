'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './InstallPrompt.module.css';

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
    <div className={styles.installPrompt}>
      <div className={styles.content}>
        <svg
          className={styles.icon}
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
        <p className={styles.text}>Install app for a better experience</p>
        <button onClick={handleInstall} className={styles.installBtn}>
          安装
        </button>
        <button onClick={handleDismiss} className={styles.dismissBtn}>
          暂不
        </button>
      </div>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
