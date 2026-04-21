import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || '银古客栈'
  const color = searchParams.get('color') || '#b8956e'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1512',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            width: 200,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            marginBottom: 40,
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: color,
            textAlign: 'center',
            padding: '0 60px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: 200,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            marginTop: 40,
          }}
        />
        <div
          style={{
            marginTop: 60,
            fontSize: 24,
            color: '#8a7a6a',
          }}
        >
          银古客栈
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
