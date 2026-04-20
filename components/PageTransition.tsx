'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    // Use native View Transition API if available
    if ('startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        setDisplayChildren(children)
      })
    } else {
      // Fallback for browsers without View Transition API
      setDisplayChildren(children)
    }
  }, [pathname, children])

  return (
    <div className="page-transition" key={pathname}>
      {displayChildren}
    </div>
  )
}
