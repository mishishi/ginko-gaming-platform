'use client'

import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { useUserContext } from '@/contexts/UserContext'

export type ShareCardType = 'checkin-streak' | 'achievement' | 'level-up' | 'milestone'

interface ShareCardModalProps {
  isOpen: boolean
  onClose: () => void
  type: ShareCardType
  data: {
    streak?: number
    achievementName?: string
    achievementIcon?: string
    level?: number
    milestone?: string
    milestoneValue?: string
  }
}

const LEVEL_NAMES = ['新晋旅人', '客栈常客', '银古居士', '迷雾行者', '命运探索者', '客栈传奇']

export default function ShareCardModal({ isOpen, onClose, type, data }: ShareCardModalProps) {
  const { userData } = useUserContext()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showCard, setShowCard] = useState(false)

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setShowCard(true)
      })
    } else {
      setShowCard(false)
    }
  }, [isOpen])

  const handleDownload = async () => {
    if (!cardRef.current) return
    setIsDownloading(true)

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1a1814',
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const link = document.createElement('a')
      link.download = `yinqiu-${type}-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Failed to generate share card:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  const getCardTitle = () => {
    switch (type) {
      case 'checkin-streak':
        return '连续签到'
      case 'achievement':
        return '成就解锁'
      case 'level-up':
        return '等级提升'
      case 'milestone':
        return '里程碑'
      default:
        return '分享'
    }
  }

  const getCardSubtitle = () => {
    switch (type) {
      case 'checkin-streak':
        return `${data.streak}天`
      case 'achievement':
        return data.achievementName
      case 'level-up':
        return `Lv.${data.level}`
      default:
        return data.milestone
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`
        fixed inset-0 z-[200] flex items-center justify-center
        transition-opacity duration-300
        ${showCard ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(10, 9, 8, 0.9)' }}
      />

      {/* Modal content */}
      <div
        className="relative flex flex-col items-center gap-6 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Share card preview */}
        <div
          ref={cardRef}
          className="relative w-[360px] overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #1a1814 0%, #0f0e0c 100%)',
            border: '1px solid rgba(184, 149, 110, 0.3)',
            boxShadow: '0 0 40px rgba(184, 149, 110, 0.2)',
          }}
        >
          {/* Decorative top bar */}
          <div
            className="h-1 w-full"
            style={{
              background: 'linear-gradient(90deg, #4a5c4f 0%, #b8956f 50%, #4a5c4f 100%)',
            }}
          />

          {/* Card content */}
          <div className="p-6 text-center">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-xl">🏮</span>
              <span
                className="text-sm tracking-widest"
                style={{ color: 'rgba(184, 149, 110, 0.7)' }}
              >
                银古客栈
              </span>
            </div>

            {/* Icon based on type */}
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(74, 92, 79, 0.6) 0%, rgba(30, 40, 30, 0.8) 100%)',
                border: '2px solid rgba(184, 149, 110, 0.4)',
                boxShadow: '0 0 30px rgba(184, 149, 110, 0.3)',
              }}
            >
              <span className="text-4xl">
                {type === 'checkin-streak' && '📅'}
                {type === 'achievement' && (data.achievementIcon || '🏅')}
                {type === 'level-up' && '⬆️'}
                {type === 'milestone' && '⭐'}
              </span>
            </div>

            {/* Title */}
            <div
              className="text-xs uppercase tracking-widest mb-2"
              style={{ color: 'rgba(184, 149, 110, 0.6)' }}
            >
              {getCardTitle()}
            </div>

            {/* Main value */}
            <div
              className="text-4xl font-bold mb-2"
              style={{
                fontFamily: 'var(--font-serif), serif',
                color: '#b8956f',
                textShadow: '0 0 20px rgba(184, 149, 110, 0.5)',
              }}
            >
              {getCardSubtitle()}
            </div>

            {/* Achievement description for achievements */}
            {type === 'achievement' && data.achievementName && (
              <div
                className="text-sm mb-4"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {data.achievementName}
              </div>
            )}

            {/* User info */}
            <div
              className="mt-4 pt-4 border-t"
              style={{ borderColor: 'rgba(184, 149, 110, 0.2)' }}
            >
              <div
                className="text-sm"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                {userData.nickname || userData.anonymousId}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: 'rgba(255, 255, 255, 0.3)' }}
              >
                {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Decorative bottom */}
          <div className="flex justify-center pb-4">
            <div
              className="flex gap-1"
              style={{ color: 'rgba(184, 149, 110, 0.4)' }}
            >
              <span className="text-xs">✦</span>
              <span className="text-xs">✦</span>
              <span className="text-xs">✦</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{
              backgroundColor: 'rgba(74, 92, 79, 0.3)',
              border: '1px solid rgba(184, 149, 110, 0.3)',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            关闭
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: '#b8956f',
              color: '#1a1814',
            }}
          >
            {isDownloading ? '生成中...' : '保存图片'}
          </button>
        </div>
      </div>
    </div>
  )
}
