'use client'

interface LanternProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
}

const sizes = {
  sm: { width: 32, height: 48 },
  md: { width: 48, height: 72 },
  lg: { width: 64, height: 96 },
}

export default function LanternDecoration({ size = 'md', className = '', style }: LanternProps) {
  const { width, height } = sizes[size]

  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 64 96'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      style={style}
      aria-hidden='true'
    >
      <defs>
        <radialGradient id='lanternGlow' cx='50%25' cy='30%25' r='50%25'>
          <stop offset='0%25' stopColor='var(--accent-copper)' stopOpacity='0.4' />
          <stop offset='100%25' stopColor='var(--accent-copper)' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='lanternBody' x1='0%25' y1='0%25' x2='100%25' y2='100%25'>
          <stop offset='0%25' stopColor='#c95433' />
          <stop offset='50%25' stopColor='#8b3319' />
          <stop offset='100%25' stopColor='#5c1f0f' />
        </linearGradient>
      </defs>

      <ellipse cx='32' cy='30' rx='28' ry='24' fill='url(#lanternGlow)' className='animate-pulse' />

      <rect x='16' y='12' width='32' height='40' rx='4' fill='url(#lanternBody)' />

      <rect x='20' y='8' width='24' height='6' rx='2' fill='var(--accent-copper)' />
      <rect x='28' y='4' width='8' height='6' rx='1' fill='var(--accent-copper)' />

      <rect x='24' y='52' width='16' height='4' rx='1' fill='var(--accent-copper)' />
      <circle cx='32' cy='60' r='3' fill='var(--accent-copper)' />

      <line x1='20' y1='20' x2='44' y2='20' stroke='#c95433' strokeWidth='1' opacity='0.5' />
      <line x1='20' y1='28' x2='44' y2='28' stroke='#c95433' strokeWidth='1' opacity='0.5' />
      <line x1='20' y1='36' x2='44' y2='36' stroke='#c95433' strokeWidth='1' opacity='0.5' />
      <line x1='20' y1='44' x2='44' y2='44' stroke='#c95433' strokeWidth='1' opacity='0.5' />

      <ellipse cx='32' cy='32' rx='8' ry='10' fill='var(--accent-copper)' opacity='0.15' className='animate-pulse' style={{ animationDelay: '0.5s' }} />
    </svg>
  )
}
