'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Trigger animation on route change
    document.body.classList.add('page-transitioning')

    const timeout = setTimeout(() => {
      document.body.classList.remove('page-transitioning')
    }, 300)

    return () => {
      clearTimeout(timeout)
      document.body.classList.remove('page-transitioning')
    }
  }, [pathname])

  return (
    <div className="page-transition" key={pathname}>
      {children}
    </div>
  )
}
