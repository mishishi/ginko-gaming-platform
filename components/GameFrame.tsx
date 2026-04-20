'use client'

import { useState } from 'react'
import { Game } from '@/lib/games'

interface GameFrameProps {
  game: Game
}

export default function GameFrame({ game }: GameFrameProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0d0f] z-10">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: `${game.color}`, borderTopColor: 'transparent' }}
            />
            <span className="text-[#8a8680] text-sm">
              加载中...
            </span>
          </div>
        </div>
      )}

      {/* iframe */}
      <iframe
        src={game.devUrl}
        className="w-full h-full border-0"
        onLoad={() => setIsLoading(false)}
        title={game.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {/* Reserved: postMessage communication */}
      {/* Games can send messages via window.parent.postMessage() */}
    </div>
  )
}
