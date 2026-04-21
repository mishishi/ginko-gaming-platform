'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionState, setTransitionState] = useState<'idle' | 'exiting' | 'entering'>('idle')
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      // First load: just do enter animation
      isFirstRender.current = false
      setDisplayChildren(children)
      setTransitionState('entering')
      const timer = setTimeout(() => setTransitionState('idle'), 400)
      return () => clearTimeout(timer)
    }

    // Route change: exit then enter
    setTransitionState('exiting')
    const exitTimer = setTimeout(() => {
      setDisplayChildren(children)
      setTransitionState('entering')
    }, 300)

    const enterTimer = setTimeout(() => {
      setTransitionState('idle')
    }, 700)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(enterTimer)
    }
  }, [pathname, children])

  return (
    <div className="page-transition-container">
      <div className={`page-transition ${transitionState === 'exiting' ? 'page-exiting' : transitionState === 'entering' ? 'page-entering' : ''}`}>
        {displayChildren}
      </div>
    </div>
  )
}
