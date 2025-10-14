"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useUserDataContext } from "@/contexts/UserDataContext"
import { getDomainInfo } from "@/lib/domainMapping"
import Image from "next/image"

export default function Home() {
  const [showName, setShowName] = useState("")
  const [showButton, setShowButton] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const {
    prefetchUserData,
    loading: dataLoading,
    userData,
    setUsername,
  } = useUserDataContext()
  const router = useRouter()

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

  // Set username and display name from domain mapping
  useEffect(() => {
    const { username, displayName } = getDomainInfo(domainInfo.host)
    setUsername(username)
    setShowName(displayName)
    setShowButton(true)

    // Start prefetching user data immediately
    console.log("Starting data prefetch on root page for:", username)
    prefetchUserData(username)
  }, [domainInfo.host, prefetchUserData, setUsername])

  // Navigate when data is ready
  useEffect(() => {
    if (showWelcome && userData && !dataLoading) {
      console.log("Data loaded, navigating to intro page")
      router.push("/intro")
    }
  }, [showWelcome, userData, dataLoading, router])

  const handleViewPortfolio = () => {
    setShowWelcome(true)
  }

  return (
    <>
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animated-bg {
          background: linear-gradient(
            -45deg,
            #000000,
            #0a0414,
            #1a0b2e,
            #2d1b69,
            #4c1d95,
            #6b21a8,
            #7c3aed
          );
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }
      `}</style>
      <div className="h-screen w-full animated-bg flex flex-col items-center justify-center overflow-hidden relative">
        {/* Much darker overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10">
          {showWelcome ? (
            // Welcome Loading Screen
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-white flex items-center gap-2">
                Welcome
                <span className="inline-flex gap-1">
                  <span className="animate-pulse-fast animation-delay-0">
                    .
                  </span>
                  <span className="animate-pulse-fast animation-delay-200">
                    .
                  </span>
                  <span className="animate-pulse-fast animation-delay-400">
                    .
                  </span>
                </span>
              </h1>
            </div>
          ) : (
            // Initial View Portfolio Button
            showButton && (
              <div className="flex flex-col lg:flex-row items-center justify-center bg-black/70 rounded-3xl backdrop-blur-3xl transition-all duration-500 ease-in-out p-6 lg:p-8 gap-4 lg:gap-0 border border-purple-400/30">
                {/* User Icon and Domain Name */}
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src="/images/man.png"
                    alt="User"
                    width={96}
                    height={96}
                    className="w-20 h-20 lg:w-24 lg:h-24 text-white"
                  />
                  {showName && (
                    <span className="text-white text-base lg:text-lg font-semibold mt-3 lg:mt-4">
                      {showName}
                    </span>
                  )}
                </div>

                {/* Button */}
                <button
                  onClick={handleViewPortfolio}
                  className="group flex flex-row items-center justify-center gap-3 bg-purple-600/50 hover:bg-purple-500/60 hover:scale-105 rounded-3xl backdrop-blur-3xl transition-all duration-500 ease-in-out cursor-pointer p-4 lg:p-8 lg:ml-8 border border-purple-400/50 hover:border-purple-300/70"
                >
                  <span className="text-white text-base lg:text-lg font-semibold">
                    View Portfolio
                  </span>
                  <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-purple-500/50 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-400/60 transition-all duration-300">
                    <svg
                      className="w-4 h-4 text-purple-200 group-hover:text-white group-hover:-rotate-15 transition-transform duration-300 ease-in-out"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ transformOrigin: "center" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </>
  )
}
