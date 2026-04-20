import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '银古客栈',
    short_name: '银古',
    description: '旅人的游戏驿站',
    start_url: '/',
    display: 'standalone',
    theme_color: '#d4a574',
    background_color: '#0a0d0f',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
