"use client"

import { useEffect } from "react"
import { useUserDataContext } from "@/contexts/UserDataContext"
import TextTypeClient from "../client/intro-client/TextTypeClient"
import LogoLoopClient from "../client/intro-client/LogoLoopClient"
import PixelBlastClient from "../client/intro-client/PixelBlastClient"
import Link from "next/link"
import { LeetCodeButton } from "../client/intro-client/LeetCodeButton"
import { GitHubButton } from "../client/intro-client/GitHubButton"
import { LinkedInButton } from "../client/intro-client/LinkedInButton"
import LoadingSpinner from "../ui/loading-spinner"
import {
  SkeletonBox,
  SkeletonText,
  SkeletonProfile,
  SkeletonTechLogos,
} from "../ui/skeleton-loading"

export default function PortfolioPage() {
  const { userData, loading, error, prefetchUserData } = useUserDataContext()

  // Fallback: If data wasn't prefetched, fetch it now
  useEffect(() => {
    if (!userData && !loading && !error) {
      console.log("Data not prefetched, fetching now")
      prefetchUserData("jatin")
    }
  }, [userData, loading, error, prefetchUserData])

  // Debug logging
  console.log("PortfolioPage render:", {
    userData: userData ? "Data exists" : "No data",
    loading,
    error,
    userDataKeys: userData ? Object.keys(userData) : [],
    bio: userData?.bio,
    fullName: userData?.fullName,
  })

  // Show error state
  if (error) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Error Loading Portfolio
          </h2>
          <p className="text-white/60 mb-4 max-w-md">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => {
                // Clear cache and retry
                window.location.href =
                  window.location.href + "?retry=" + Date.now()
              }}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Clear Cache & Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex relative transition-colors duration-300 bg-black text-white">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <PixelBlastClient />
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-300 bg-purple-900/10" />

      <main
        className="relative z-10 w-screen overflow-hidden p-1"
        style={{ height: "100dvh" }}
      >
        {/* Mobile: 6x6 Grid, Tablet: 8x5, Desktop: 8x6 Grid */}
        <div
          className="relative grid grid-cols-6 grid-rows-6 md:grid-cols-8 md:grid-rows-5 lg:grid-rows-6 md:p-6 lg:p-10"
          style={{
            gap: "10px",
            padding: "6px",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Description Box - Mobile: 2x3, Tablet: 6x3, Desktop: 6x4 */}
          <div className="col-span-3 row-span-3 col-start-1 row-start-1 md:col-span-6 md:row-span-3 lg:col-span-6 lg:row-span-4 md:col-start-1 md:row-start-2 lg:row-start-2 rounded-2xl md:rounded-3xl border-2 p-1 md:p-4 lg:p-6 flex flex-col z-10 group hover:border-transparent transition-all duration-300 hover:bg-opacity-80 relative backdrop-blur-sm bg-[#0F0F0F]/80 border-purple-500/20">
            <h2 className="text-[14px] md:text-xl lg:text-2xl font-bold mb-0.5 md:mb-3 lg:mb-4 pointer-events-none relative z-0">
              About Me
            </h2>
            <div className="leading-tight md:leading-relaxed overflow-y-auto scrollbar-hide flex-1 font-light text-[11px] md:text-sm lg:text-base xl:text-lg tracking-wide relative z-0 text-white/80">
              {loading ? (
                <SkeletonText lines={4} />
              ) : userData?.bio ? (
                <TextTypeClient text={userData.bio} />
              ) : (
                <div className="text-white/60">Loading bio...</div>
              )}
            </div>
          </div>

          {/* Profile Image - Mobile: 3x2, Tablet: 2x3, Desktop: 2x4 */}
          <div className="col-span-3 row-span-2 col-start-4 row-start-1 md:col-span-2 md:row-span-3 lg:row-span-4 md:col-start-7 md:row-start-1 lg:col-start-7 rounded-2xl md:rounded-3xl border-2 flex items-center justify-center z-10 group hover:border-transparent transition-all duration-300 hover:bg-opacity-80 relative backdrop-blur-sm overflow-hidden bg-[#0F0F0F]/80 border-purple-500/20">
            {loading ? (
              <SkeletonProfile />
            ) : (
              <img
                src={userData?.profilePictureUrl}
                alt={userData?.fullName}
                className="w-full h-full object-cover pointer-events-none relative z-0"
              />
            )}
          </div>

          {/* Tech Logos Strip - Mobile: 3x1, Tablet: 6x1, Desktop: 6x1 */}
          <div className="col-span-3 row-span-1 col-start-1 row-start-5 md:col-span-6 md:row-span-1 md:col-start-1 md:row-start-1 lg:col-start-1 lg:row-start-1 rounded-2xl md:rounded-3xl border-2 overflow-hidden relative z-10 group hover:border-transparent transition-all duration-300 backdrop-blur-sm bg-[#0F0F0F]/80 border-purple-500/20">
            <div className="flex items-center h-full px-0 md:px-6">
              {loading ? (
                <SkeletonTechLogos />
              ) : (
                <LogoLoopClient techStack={userData?.techStack || []} />
              )}
            </div>
          </div>

          {/* LeetCode Button - Mobile: 3x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-4 row-span-1 col-start-1 row-start-4 md:col-span-2 md:row-start-5 lg:row-start-6 md:col-start-1 z-10">
            {loading ? (
              <SkeletonBox className="h-full" />
            ) : (
              <LeetCodeButton
                leetcodeUsername={userData?.socialLinks?.leetcodeProfile || ""}
              />
            )}
          </div>

          {/* LinkedIn Button - Mobile: 3x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-3 row-span-1 col-start-4 row-start-5 md:col-span-2 md:row-start-5 lg:row-start-6 md:col-start-3 z-10">
            {loading ? (
              <SkeletonBox className="h-full" />
            ) : (
              <LinkedInButton
                linkedinUrl={userData?.socialLinks?.linkedInProfile || ""}
              />
            )}
          </div>

          {/* GitHub Button - Mobile: 3x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-3 row-span-1 col-start-4 row-start-3 md:col-span-2 md:row-start-5 lg:row-start-6 md:col-start-5 z-10">
            {loading ? (
              <SkeletonBox className="h-full" />
            ) : (
              <GitHubButton
                githubUsername={userData?.socialLinks?.githubProfile || ""}
              />
            )}
          </div>

          {/* Projects Button - Mobile: 2x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-2 row-span-1 col-start-5 row-start-4 md:col-span-2 md:row-start-4 lg:row-start-5 lg:col-start-7 md:col-start-7 z-10">
            <Link
              href={{
                pathname: "/projects",
                query: {
                  githubRepos: (userData?.githubRepos || []).join(","),
                },
              }}
              prefetch={true}
            >
              <button className="w-full h-full rounded-2xl lg:rounded-3xl border-2 p-0.5 lg:p-3 flex flex-col items-center justify-center transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-purple-500/15 border-purple-400/40">
                <div className="font-semibold text-[13px] lg:text-base group-hover:text-purple-400 transition-colors duration-300">
                  Projects
                </div>
                <div className="text-[11px] lg:text-sm font-light text-white/80">
                  Portfolio
                </div>
              </button>
            </Link>
          </div>

          {/* Contact Button - Mobile: 2x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-6 row-span-1 col-start-1 row-start-6 md:col-span-2 md:row-start-5 lg:row-start-6 lg:col-start-7 md:col-start-7 z-10">
            <Link href="/contact" prefetch={true}>
              <button className="w-full h-full rounded-2xl lg:rounded-3xl border-2 p-0.5 lg:p-3 flex flex-col items-center justify-center transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-purple-600/15 border-purple-500/40">
                <div className="font-semibold text-[13px] lg:text-base group-hover:text-purple-400 transition-colors duration-300">
                  Contact
                </div>
                <div className="text-[11px] lg:text-sm font-light text-white/80">
                  Get in Touch
                </div>
              </button>
            </Link>
          </div>

          {/* Empty space - Mobile: 2x1 (col 4-5, row 5) */}
          <div className="col-span-2 row-span-1 col-start-4 row-start-5 lg:hidden" />
        </div>
      </main>
    </div>
  )
}
