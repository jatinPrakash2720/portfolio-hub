"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { FaUser } from "react-icons/fa"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [showName, setShowName] = useState("")
  const [showButton, setShowButton] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  // Memoize domain check to prevent unnecessary re-renders
  const domainInfo = useMemo(() => {
    if (typeof window !== "undefined") {
      return {
        host: window.location.host,
        href: window.location.href,
      }
    }
    return { host: "", href: "" }
  }, [])

  // Run domain check as first operation
  useEffect(() => {
    setShowName(domainInfo.host)

    // Add delay for button appearance
    const timer = setTimeout(() => {
      setShowButton(true)
    }, 1000) // 1 second delay

    return () => clearTimeout(timer)
  }, [domainInfo.host])

  // Optimize button click handler with useCallback
  const handleButtonClick = useCallback(() => {
    setShowWelcome(true)

    // After 1.5 seconds, go directly to portfolio
    const timer = setTimeout(() => {
      router.push("/intro")
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="h-screen w-full bg-purple-950/10 flex flex-col items-center justify-center overflow-hidden">
      {showButton && !showWelcome && (
        <button
          onClick={handleButtonClick}
          className="flex flex-col items-center justify-center bg-purple-950/20 hover:scale-105 animate-pulse hover:animate-none rounded-3xl backdrop-blur-3xl transition-all duration-500 ease-in-out cursor-pointer p-8"
        >
          <FaUser size={48} className="text-white" />
          {showName && (
            <span className="text-white text-lg font-semibold mt-4">
              {showName}
            </span>
          )}
        </button>
      )}

      {showWelcome && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-4xl font-bold text-white text-center animate-bounce">
            Welcome!
          </h1>
        </div>
      )}
    </div>
  )
}
