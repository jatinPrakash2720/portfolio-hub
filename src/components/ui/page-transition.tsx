"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const pathname = usePathname()

  useEffect(() => {
    // Start transition when pathname changes
    setIsTransitioning(true)

    // Update children after a short delay
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsTransitioning(false)
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isTransitioning
          ? "opacity-0 scale-95 translate-y-2"
          : "opacity-100 scale-100 translate-y-0"
      }`}
    >
      {displayChildren}
    </div>
  )
}
