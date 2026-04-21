'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/components/ThemeProvider'
import { useKeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp'
import SoundToggle from '@/components/SoundToggle'

const games = [
  { slug: 'idol', name: '偶像' },
  { slug: 'quiz', name: '竞技' },
  { slug: 'fate', name: '命运' },
]

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  )
}

export default function NavBar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { toggle: toggleKeyboardHelp } = useKeyboardShortcutsHelp()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMd, setIsMd] = useState(true)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMd(window.innerWidth >= 768)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const isGamePage = pathname.startsWith('/games/')

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--accent-copper)] focus:text-[var(--bg-primary)] focus:text-sm focus:font-medium focus:outline-none focus:rounded"
      >
        跳转到主要内容
      </a>

      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-sm border-b border-[var(--border-subtle)]"
        aria-label="主导航"
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-lg text-[var(--accent-silver)] hover:text-[var(--text-primary)] transition-colors duration-300 tracking-wider focus:outline-none focus:ring-1 focus:ring-[var(--accent-copper)] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded px-1"
            style={{ fontFamily: 'var(--font-serif), Noto Serif SC, serif' }}
          >
            银古客栈
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {games.map((game) => {
              const isActive = pathname === `/games/${game.slug}`
              return (
                <Link
                  key={game.slug}
                  href={`/games/${game.slug}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative text-sm tracking-wide transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-[var(--accent-copper)] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded px-1 ${
                    isActive
                      ? 'text-[var(--accent-copper)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {game.name}
                  {isActive && (
                    <span
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-[var(--accent-copper)]"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-[var(--accent-copper)] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded"
            aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Help Button */}
          <button
            onClick={toggleKeyboardHelp}
            className="p-2 rounded hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--accent-copper)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--accent-copper)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
            aria-label="键盘快捷键"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>

          {/* Sound Toggle */}
          <SoundToggle />

          {/* Mobile Menu Button */}
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-[var(--accent-copper)] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded"
            aria-label="打开导航菜单"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <MenuIcon />
          </button>
        </div>

        {/* Breadcrumb for game pages */}
        {isGamePage && isMd && (
          <div className="hidden md:block border-t border-[var(--border-subtle)] px-4 py-1.5">
            <nav aria-label="面包屑导航">
              <ol className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <li>
                  <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
                    首页
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <span className="text-[var(--text-secondary)]">
                    {games.find(g => pathname === `/games/${g.slug}`)?.name}
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Mobile Menu Drawer */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="移动端导航菜单"
        className={`fixed top-0 right-0 bottom-0 z-[70] w-64 bg-[var(--bg-secondary)] border-l border-[var(--border-subtle)] transform transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border-subtle)]">
            <span
              className="font-serif text-[var(--accent-silver)] tracking-wider"
              style={{ fontFamily: 'var(--font-serif), Noto Serif SC, serif' }}
            >
              银古客栈
            </span>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--accent-copper)] focus:rounded"
              aria-label="关闭导航菜单"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col p-4 gap-1">
            {games.map((game) => {
              const isActive = pathname === `/games/${game.slug}`
              return (
                <Link
                  key={game.slug}
                  href={`/games/${game.slug}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-2.5 text-sm rounded transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[var(--accent-copper)] focus:ring-offset-1 ${
                    isActive
                      ? 'bg-[var(--bg-card)] text-[var(--accent-copper)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {game.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
