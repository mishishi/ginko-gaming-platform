import type { Metadata, Viewport } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'
import PageTransition from '@/components/PageTransition'
import { GameStatusProvider } from '@/components/GameStatusProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import ResourceHints from '@/components/ResourceHints'
import { notoSansSC, notoSerifSC } from '@/lib/fonts'
import TourGuide from '@/components/TourGuide'
import InstallPrompt from '@/components/InstallPrompt'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import KeyboardShortcutsProvider from '@/components/KeyboardShortcutsProvider'

export const metadata: Metadata = {
  title: '银古客栈',
  description: '旅人的游戏驿站',
  icons: {
    icon: '/icon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${notoSansSC.variable} ${notoSerifSC.variable}`}>
      <head>
        <ResourceHints />
      </head>
      <body>
        <ServiceWorkerRegistration />
        <GameStatusProvider>
          <ThemeProvider>
            <TourGuide />
            <InstallPrompt />
            {/* Skip to main content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--accent-copper)] focus:text-[var(--bg-primary)] focus:text-sm focus:font-medium focus:outline-none"
            >
              跳转到主要内容
            </a>

            <NavBar />
            <KeyboardShortcutsProvider />
            <main id="main-content" className="relative z-10">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
          </ThemeProvider>
        </GameStatusProvider>
      </body>
    </html>
  )
}
