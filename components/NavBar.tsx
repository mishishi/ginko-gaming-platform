'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const games = [
  { slug: 'idol', name: '偶像', color: '#ff9ecf' },
  { slug: 'quiz', name: '竞技', color: '#00f5ff' },
  { slug: 'fate', name: '命运', color: '#b8945f' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0d0f]/85 border-b border-[#1a1f24]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl text-[#d4a574] hover:text-[#e8e4df] transition-colors duration-300"
        >
          银古客栈
        </Link>

        {/* Game links */}
        <div className="flex items-center gap-6">
          {games.map((game) => {
            const isActive = pathname === `/games/${game.slug}`
            return (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className="relative group"
              >
                <span
                  className={`text-sm transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-[#8a8680] hover:text-[#e8e4df]'
                  }`}
                >
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
      </div>
    </nav>
  )
}
