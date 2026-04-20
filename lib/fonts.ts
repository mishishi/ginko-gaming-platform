import { Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google'
import localFont from 'next/font/local'

// Cormorant Garamond - 优雅的衬线体，用于英文标题
const cormorant = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
})

export const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-sans',
})

export const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-serif',
})
