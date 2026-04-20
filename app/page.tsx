import GameCard from '@/components/GameCard'
import { games } from '@/lib/games'

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1
            className="font-serif text-5xl md:text-6xl text-[#d4a574] mb-4 animate-fade-in-up"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            银古客栈
          </h1>
          <p className="text-[#8a8680] text-lg md:text-xl animate-fade-in-up stagger-2">
            旅人的游戏驿站
          </p>
        </div>

        {/* Decorative line */}
        <div className="mt-8 flex justify-center animate-fade-in stagger-3">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4a574] to-transparent opacity-50" />
        </div>
      </section>

      {/* Games Display Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-center text-[#8a8680] text-sm uppercase tracking-widest mb-12 animate-fade-in stagger-3">
          珍藏展品
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <GameCard key={game.slug} game={game} index={index} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <div className="w-16 h-px bg-[#1a1f24] mx-auto mb-6" />
        <p className="text-[#8a8680] text-sm">
          银古客栈 · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}