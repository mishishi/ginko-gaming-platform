'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const games = [
  { slug: 'idol', name: '偶像', color: '#ff9ecf' },
  { slug: 'quiz', name: '竞技', color: '#00f5ff' },
  { slug: 'fate', name: '命运', color: '#b8945f' },
]

function MenuIcon({ ariaLabel }: { ariaLabel: string }) {
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
      aria-label={ariaLabel}
      focusable="true"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function CloseIcon({ ariaLabel }: { ariaLabel: string }) {
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
      aria-label={ariaLabel}
      focusable="true"
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

  // Track screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMd(window.innerWidth >= 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen])

  // Prevent body scroll when mobile menu is open
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
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0d0f]/85 border-b border-[#1a1f24]"
        role="navigation"
        aria-label="主导航"
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-xl text-[#d4a574] hover:text-[#e8e4df] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded"
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
                  className={`relative group focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded px-1 py-1 ${
                    isActive ? 'text-white' : 'text-[#8a8680] hover:text-[#e8e4df]'
                  }`}
                >
                  <span className="text-sm transition-all duration-300">
                    {game.name}
                  </span>
                  {/* Glow indicator */}
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: game.color }}
                  />
                </Link>
              )
            })}
          </div>

          {/* Mobile: Hamburger button */}
          <button
            type="button"
            onClick={openMobileMenu}
            className="md:hidden p-2 text-[#8a8680] hover:text-[#e8e4df] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded"
            aria-label="打开导航菜单"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <MenuIcon ariaLabel="菜单图标" />
          </button>
        </div>

        {/* Desktop Breadcrumbs */}
        {isGamePage && currentGameName && isMd && (
          <div className="hidden md:block border-t border-[#1a1f24] px-4 py-2">
            <ol className="flex items-center gap-2 text-sm text-[#8a8680]" aria-label="面包屑导航">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#e8e4df] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded px-1"
                >
                  银古客栈
                </Link>
              </li>
              <li className="flex items-center gap-2" aria-hidden="true">
                <ChevronRightIcon />
                <span className="text-[#e8e4df]" aria-current="page">
                  {currentGameName}
                </span>
              </li>
            </ol>
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
          className="absolute inset-0 bg-[#0a0d0f]/60 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      </div>

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="移动端导航菜单"
        className={`fixed top-0 right-0 bottom-0 z-[70] w-72 max-w-[80vw] bg-[#0a0d0f]/95 backdrop-blur-md border-l border-[#1a1f24] transform transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-[#1a1f24]">
            <Link
              href="/"
              className="font-serif text-xl text-[#d4a574] hover:text-[#e8e4df] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded"
              onClick={closeMobileMenu}
            >
              银古客栈
            </Link>
            <button
              type="button"
              onClick={closeMobileMenu}
              className="p-2 text-[#8a8680] hover:text-[#e8e4df] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded"
              aria-label="关闭导航菜单"
            >
              <CloseIcon ariaLabel="关闭图标" />
            </button>
          </div>

          {/* Mobile Breadcrumbs */}
          {isGamePage && currentGameName && (
            <div className="px-4 py-3 border-b border-[#1a1f24]">
              <ol className="flex items-center gap-2 text-sm text-[#8a8680]" aria-label="面包屑导航">
                <li>
                  <Link
                    href="/"
                    className="hover:text-[#e8e4df] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:ring-offset-2 focus:ring-offset-bg-primary focus:rounded px-1"
                    onClick={closeMobileMenu}
                  >
                    银古客栈
                  </Link>
                </li>
                <li className="flex items-center gap-2" aria-hidden="true">
                  <ChevronRightIcon />
                  <span className="text-[#e8e4df]" aria-current="page">
                    {currentGameName}
                  </span>
                </li>
              </ol>
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
                  className={`relative group px-3 py-3 rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:ring-offset-2 focus:ring-offset-bg-primary ${
                    isActive
                      ? 'bg-[#1a1f24] text-white'
                      : 'text-[#8a8680] hover:text-[#e8e4df] hover:bg-[#12161a]'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center gap-3">
                    {/* Game indicator dot */}
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: game.color }}
                    />
                    <span className="text-base">{game.name}</span>
                  </div>
                  {/* Active indicator */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r"
                      style={{ backgroundColor: game.color }}
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
