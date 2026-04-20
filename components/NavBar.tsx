'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

const games = [
  { slug: 'idol', name: '偶像', color: '#ff9ecf' },
  { slug: 'quiz', name: '竞技', color: '#00f5ff' },
  { slug: 'fate', name: '命运', color: '#b8945f' },
]

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
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
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export default function NavBar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMd, setIsMd] = useState(true)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const menuEscapeRef = useRef(isMobileMenuOpen)

  // Keep ref in sync with state for escape handler
  useEffect(() => {
    menuEscapeRef.current = isMobileMenuOpen
  }, [isMobileMenuOpen])

  // Track screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMd(window.innerWidth >= 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Close mobile menu on escape key - always listening
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuEscapeRef.current) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Keyboard trap for mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const menu = mobileMenuRef.current
    if (!menu) return

    const focusableElements = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    menu.addEventListener('keydown', handleTab)
    return () => menu.removeEventListener('keydown', handleTab)
  }, [isMobileMenuOpen])

  // Prevent body scroll and manage focus when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      // Focus first element in menu
      const menu = mobileMenuRef.current
      if (menu) {
        const firstLink = menu.querySelector<HTMLElement>('a[href], button')
        firstLink?.focus()
      }
    } else {
      document.body.style.overflow = ''
      // Return focus to hamburger button
      hamburgerRef.current?.focus()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Determine if we're on a game page and get the game name
  const isGamePage = pathname.startsWith('/games/')
  const currentGame = games.find((g) => pathname === `/games/${g.slug}`)
  const currentGameName = currentGame?.name

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Skip to content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent-amber focus:text-bg-primary focus:font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-bg-primary"
      >
        跳转到主要内容
      </a>

      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--bg-primary)]/85 border-b border-[var(--bg-card)]"
        aria-label="主导航"
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-xl text-[var(--accent-amber)] hover:text-[var(--text-primary)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded"
          >
            银古客栈
          </Link>

          {/* Desktop: Game links */}
          <div className="hidden md:flex items-center gap-6">
            {games.map((game) => {
              const isActive = pathname === `/games/${game.slug}`
              return (
                <Link
                  key={game.slug}
                  href={`/games/${game.slug}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative group focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded px-1 py-1 ${
                    isActive ? 'text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="text-sm transition-all duration-300">
                    {game.name}
                  </span>
                  {/* Glow indicator */}
                  <span
                    className={`absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    style={{ color: game.color }}
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </div>

          {/* Mobile: Hamburger button */}
          <button
            ref={hamburgerRef}
            type="button"
            onClick={openMobileMenu}
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded"
            aria-label="打开导航菜单"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <MenuIcon />
          </button>
        </div>

        {/* Desktop Breadcrumbs */}
        {isGamePage && currentGameName && isMd && (
          <div className="hidden md:block border-t border-[var(--bg-card)] px-4 py-2">
            <nav aria-label="面包屑导航">
              <ol className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <li>
                  <Link
                    href="/"
                    className="hover:text-[var(--text-primary)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded px-1"
                  >
                    银古客栈
                  </Link>
                </li>
                <li className="flex items-center gap-2" aria-hidden="true">
                  <ChevronRightIcon />
                </li>
                <li>
                  <span className="text-[var(--text-primary)]" aria-current="page">
                    {currentGameName}
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
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Backdrop with blur */}
        <div
          className="absolute inset-0 bg-[var(--bg-primary)]/60 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      </div>

      {/* Mobile Menu Drawer */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="移动端导航菜单"
        className={`fixed top-0 right-0 bottom-0 z-[70] w-72 max-w-[80vw] bg-[var(--bg-primary)]/95 backdrop-blur-md border-l border-[var(--bg-card)] transform transition-transform duration-300 ease-out md:hidden overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col min-h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--bg-card)] shrink-0">
            <Link
              href="/"
              className="font-serif text-xl text-[var(--accent-amber)] hover:text-[var(--text-primary)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded"
              onClick={closeMobileMenu}
            >
              银古客栈
            </Link>
            <button
              type="button"
              onClick={closeMobileMenu}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded"
              aria-label="关闭导航菜单"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Mobile Breadcrumbs */}
          {isGamePage && currentGameName && (
            <div className="px-4 py-3 border-b border-[var(--bg-card)] shrink-0">
              <nav aria-label="面包屑导航">
                <ol className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-[var(--text-primary)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded px-1"
                      onClick={closeMobileMenu}
                    >
                      银古客栈
                    </Link>
                  </li>
                  <li className="flex items-center gap-2" aria-hidden="true">
                    <ChevronRightIcon />
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]" aria-current="page">
                      {currentGameName}
                    </span>
                  </li>
                </ol>
              </nav>
            </div>
          )}

          {/* Drawer Navigation Links */}
          <div className="flex flex-col gap-1 px-4 py-4">
            {games.map((game) => {
              const isActive = pathname === `/games/${game.slug}`
              return (
                <Link
                  key={game.slug}
                  href={`/games/${game.slug}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative group px-3 py-3 rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] focus:ring-offset-2 focus:ring-offset-bg-primary ${
                    isActive
                      ? 'bg-[var(--bg-card)] text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center gap-3">
                    {/* Game indicator dot */}
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: game.color }}
                      aria-hidden="true"
                    />
                    <span className="text-base">{game.name}</span>
                  </div>
                  {/* Active indicator */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r"
                      style={{ backgroundColor: game.color }}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
