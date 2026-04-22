import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '银古客栈 - Silver Ancient Inn',
    short_name: '银古客栈',
    description: '旅人的游戏驿站 - A gaming inn for travelers',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#0f0f0f',
    background_color: '#0f0f0f',
    categories: ['games', 'entertainment'],
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: '偶像收藏',
        short_name: '偶像',
        description: '收集你的偶像，组成最强阵容',
        url: '/games/idol',
        icons: [{ src: '/favicon.svg', sizes: 'any' }],
      },
      {
        name: '知识竞技',
        short_name: '问答',
        description: '知识对战，先得10分获胜',
        url: '/games/quiz',
        icons: [{ src: '/favicon.svg', sizes: 'any' }],
      },
      {
        name: '命运占卜',
        short_name: '占卜',
        description: '探索你的命运轨迹',
        url: '/games/fate',
        icons: [{ src: '/favicon.svg', sizes: 'any' }],
      },
    ],
  };
}
