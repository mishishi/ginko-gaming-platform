export interface Game {
  slug: string
  title: string
  subtitle: string
  description: string
  color: string
  glowColor: string
  devUrl: string
  prodUrl: string
  /** Theme gradient for game card background */
  theme: string
  /** Difficulty: 1–5 stars */
  difficulty: number
  /** Player count range label */
  playerCount: string
  /** Whether the game is currently playable */
  playable: boolean
}

export const games: Game[] = [
  {
    slug: 'idol',
    title: '偶像收藏',
    subtitle: '收集你的偶像，组成最强阵容',
    description: '在樱粉色的梦境中，遇见独一无二的她。每一次抽取都是惊喜，每一张卡牌都值得珍藏。',
    color: '#ff9ecf',
    glowColor: 'rgba(255,158,207,0.4)',
    devUrl: 'http://localhost:3002',
    prodUrl: 'https://idol.yourdomain.com',
    theme: 'linear-gradient(135deg, #1a0a14 0%, #2d1024 40%, #3d1a2e 70%, #1a0a14 100%)',
    difficulty: 2,
    playerCount: '1-2人',
    playable: true,
  },
  {
    slug: 'quiz',
    title: '知识竞技',
    subtitle: '知识对战，先得 10 分获胜',
    description: '文学、历史、地理、科学……谁才是真正的百科全书？与好友一战，见证知识的巅峰对决。',
    color: '#00f5ff',
    glowColor: 'rgba(0,245,255,0.4)',
    devUrl: 'http://localhost:3003',
    prodUrl: 'https://quiz.yourdomain.com',
    theme: 'linear-gradient(135deg, #0a1a1a 0%, #0d2424 40%, #0a2020 70%, #0a1a1a 100%)',
    difficulty: 3,
    playerCount: '2人',
    playable: true,
  },
  {
    slug: 'fate',
    title: '命运占卜',
    subtitle: '探索你的命运轨迹',
    description: '古老的星盘缓缓转动，命运的丝线若隐若现。AI与你对话，探寻那些指引前路的答案。',
    color: '#b8945f',
    glowColor: 'rgba(184,148,95,0.4)',
    devUrl: 'http://localhost:3004',
    prodUrl: 'https://fate.yourdomain.com',
    theme: 'linear-gradient(135deg, #12100a 0%, #1a1610 40%, #241c14 70%, #12100a 100%)',
    difficulty: 1,
    playerCount: '1人',
    playable: false,
  },
]

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug)
}
