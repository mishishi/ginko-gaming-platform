export interface Game {
  slug: string
  title: string
  subtitle: string
  description: string
  color: string
  glowColor: string
  devUrl: string
  prodUrl: string
}

export const games: Game[] = [
  {
    slug: 'idol',
    title: '偶像收藏',
    subtitle: '收集你的偶像，组成最强阵容',
    description: '偶像收集类卡牌游戏',
    color: '#ff9ecf',
    glowColor: 'rgba(255,158,207,0.4)',
    devUrl: 'http://localhost:3002',
    prodUrl: 'https://idol.yourdomain.com',
  },
  {
    slug: 'quiz',
    title: '知识竞技',
    subtitle: '知识对战，先得 10 分获胜',
    description: '小学初中知识答题竞技',
    color: '#00f5ff',
    glowColor: 'rgba(0,245,255,0.4)',
    devUrl: 'http://localhost:3003',
    prodUrl: 'https://quiz.yourdomain.com',
  },
  {
    slug: 'fate',
    title: '命运占卜',
    subtitle: '探索你的命运轨迹',
    description: 'AI算命占卜类游戏',
    color: '#b8945f',
    glowColor: 'rgba(184,148,95,0.4)',
    devUrl: 'http://localhost:3004',
    prodUrl: 'https://fate.yourdomain.com',
  },
]

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug)
}
