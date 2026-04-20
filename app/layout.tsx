import type { Metadata, Viewport } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'

export const metadata: Metadata = {
  title: '银古客栈',
  description: '旅人的游戏驿站',
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
    <html lang="zh-CN">
      <body>
        <div className="fog-bg" />
        <NavBar />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
