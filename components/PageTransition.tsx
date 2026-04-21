'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 400)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div className={`page-transition ${isAnimating ? 'page-entering' : ''}`}>
      {children}
    </div>
  )
}
