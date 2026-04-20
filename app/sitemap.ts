import { MetadataRoute } from 'next'
import { games } from '@/lib/games'

const baseUrl = 'https://ginko.example.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const gamePages = games.map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: game.playable ? 0.8 : 0.5,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...gamePages,
  ]
}
