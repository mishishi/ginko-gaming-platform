'use client'

import { useGameStatus } from '@/components/GameStatusProvider'
import GameCard from '@/components/GameCard'
import HomepageSkeleton from '@/components/HomepageSkeleton'
import { games } from '@/lib/games'

export default function GameGrid() {
  const { isLoading } = useGameStatus()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {isLoading ? (
        <HomepageSkeleton />
      ) : (
        games.map((game, index) => (
          <GameCard key={game.slug} game={game} index={index} />
        ))
      )}
    </div>
  )
}
