'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setDisplayChildren(children)
        setIsTransitioning(false)
        prevPathname.current = pathname
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [pathname, children])

  return (
    <div
      className={`page-transition-container ${isTransitioning ? 'page-exiting' : 'page-entering'}`}
      key={pathname}
    >
      <div className={`page-transition ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {displayChildren}
      </div>
    </div>
  )
}
