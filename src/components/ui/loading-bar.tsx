"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function LoadingBar() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true)
      setProgress(0)

      // Continuous animation that keeps moving until page loads
      const interval = setInterval(() => {
        setProgress((prev) => {
          // Keep animating between 10% and 90% until page actually loads
          if (prev >= 90) {
            return 10 // Reset to 10% for continuous loop
          }
          return prev + Math.random() * 15 + 5 // Random increment between 5-20
        })
      }, 100) // Slightly slower for smoother animation

      // Store interval ID to clear it later
      ;(window as any).loadingInterval = interval
    }

    // Listen for clicks on Link components
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a[href]")
      if (link && link.getAttribute("href")?.startsWith("/")) {
        handleStart()
      }
    }

    // Listen for popstate (back/forward buttons)
    const handlePopState = () => {
      handleStart()
    }

    document.addEventListener("click", handleLinkClick)
    window.addEventListener("popstate", handlePopState)

    return () => {
      document.removeEventListener("click", handleLinkClick)
      window.removeEventListener("popstate", handlePopState)
      // Clean up any running interval
      if ((window as any).loadingInterval) {
        clearInterval((window as any).loadingInterval)
        ;(window as any).loadingInterval = null
      }
    }
  }, [])

  useEffect(() => {
    // Complete loading when pathname changes (actual page load)
    if (isLoading) {
      // Clear the continuous animation interval
      if ((window as any).loadingInterval) {
        clearInterval((window as any).loadingInterval)
        ;(window as any).loadingInterval = null
      }

      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 300) // Slightly longer to match page transition
    }
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/20">
      <div
        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300 ease-out rounded-full"
        style={{
          width: `${progress}%`,
          borderRadius: "4px",
        }}
      />
    </div>
  )
}
