"use client"

import { useEffect, useState, lazy, Suspense } from "react"
import { useUserDataContext } from "@/contexts/UserDataContext"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Lazy load UI components
const TextType = lazy(() => import("../ui/TypeText"))
const LogoLoop = lazy(() => import("../ui/LogoLoop"))
const PixelBlast = lazy(() => import("../ui/PixelBlast"))
const Cubes = lazy(() => import("../ui/Cubes"))

// Tech logo mapping function
const getTechLogos = (techStack: string[]) => {
  const techLogoMap: Record<
    string,
    { src: string; alt: string; href: string }
  > = {
    react: {
      src: "/images/icons/react.svg",
      alt: "React",
      href: "https://react.dev",
    },
    next: {
      src: "/images/icons/nextjs.svg",
      alt: "Next.js",
      href: "https://nextjs.org",
    },
    typescript: {
      src: "/images/icons/typescript.svg",
      alt: "TypeScript",
      href: "https://www.typescriptlang.org",
    },
    tailwind: {
      src: "/images/icons/tailwindcss.svg",
      alt: "Tailwind CSS",
      href: "https://tailwindcss.com",
    },
    node: {
      src: "/images/icons/nodejs.svg",
      alt: "Node.js",
      href: "https://nodejs.org",
    },
    python: {
      src: "/images/icons/python.svg",
      alt: "Python",
      href: "https://python.org",
    },
    javascript: {
      src: "/images/icons/javascript.svg",
      alt: "JavaScript",
      href: "https://javascript.info",
    },
    mongodb: {
      src: "/images/icons/mongodb.svg",
      alt: "MongoDB",
      href: "https://mongodb.com",
    },
    postgresql: {
      src: "/images/icons/postgresql.svg",
      alt: "PostgreSQL",
      href: "https://postgresql.org",
    },
    express: {
      src: "/images/icons/express.svg",
      alt: "Express.js",
      href: "https://expressjs.com",
    },
    git: {
      src: "/images/icons/git.svg",
      alt: "Git",
      href: "https://git-scm.com",
    },
    docker: {
      src: "/images/icons/docker.svg",
      alt: "Docker",
      href: "https://docker.com",
    },
    figma: {
      src: "/images/icons/figma.svg",
      alt: "Figma",
      href: "https://figma.com",
    },
    graphql: {
      src: "/images/icons/graphql.svg",
      alt: "GraphQL",
      href: "https://graphql.org",
    },
    redis: {
      src: "/images/icons/redis.svg",
      alt: "Redis",
      href: "https://redis.io",
    },
    linux: {
      src: "/images/icons/linux.svg",
      alt: "Linux",
      href: "https://linux.org",
    },
    vercel: {
      src: "/images/icons/vercel.svg",
      alt: "Vercel",
      href: "https://vercel.com",
    },
    axios: {
      src: "/images/icons/axios.svg",
      alt: "Axios",
      href: "https://axios-http.com",
    },
    cloudinary: {
      src: "/images/icons/cloudinary.svg",
      alt: "Cloudinary",
      href: "https://cloudinary.com",
    },
    vite: {
      src: "/images/icons/vite.svg",
      alt: "Vite",
      href: "https://vite.dev",
    },
  }

  return techStack
    .map((tech) => {
      const logo = techLogoMap[tech.toLowerCase()]
      if (!logo) {
        console.warn(`No logo found for tech: ${tech}`)
        return null
      }
      return {
        node: (
          <Image
            src={logo.src}
            alt={logo.alt}
            width={32}
            height={32}
            className="w-8 h-8 brightness-0 invert"
          />
        ),
        title: tech,
        href: logo.href,
      }
    })
    .filter((logo): logo is NonNullable<typeof logo> => logo !== null)
}
const LeetCodeButton = lazy(() =>
  import("../client/intro-client/LeetCodeButton").then((mod) => ({
    default: mod.LeetCodeButton,
  }))
)
const GitHubButton = lazy(() =>
  import("../client/intro-client/GitHubButton").then((mod) => ({
    default: mod.GitHubButton,
  }))
)
const LinkedInButton = lazy(() =>
  import("../client/intro-client/LinkedInButton").then((mod) => ({
    default: mod.LinkedInButton,
  }))
)
import {
  SkeletonText,
  SkeletonProfile,
  SkeletonTechLogos,
  SkeletonNavigationButton,
} from "../ui/skeleton-loading"

export default function PortfolioPage() {
  const {
    userData,
    loading,
    error,
    projectsLoading,
    contactLoading,
    username,
    prefetchUserData,
    setProjectsLoading,
    setContactLoading,
    setIntroLoading,
  } = useUserDataContext()
  const router = useRouter()
  const [isNavigatingToProjects, setIsNavigatingToProjects] = useState(false)
  const [isNavigatingToContact, setIsNavigatingToContact] = useState(false)

  // Fallback: If data wasn't prefetched, fetch it now
  useEffect(() => {
    if (!userData && !loading && !error) {
      console.log("Data not prefetched, fetching now")
      const usernameToUse = username || "jatin" // fallback to jatin if no username
      prefetchUserData(usernameToUse)
    }
  }, [userData, loading, error, prefetchUserData, username])

  // Clear intro loading state when component mounts
  useEffect(() => {
    setIntroLoading(false)
  }, [setIntroLoading])

  // Handle projects navigation with loading state
  const handleProjectsNavigation = async () => {
    setIsNavigatingToProjects(true)
    setProjectsLoading(true)

    // Small delay to show the loading state
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Construct URL with query parameters
    const githubReposParam = (userData?.githubRepos || []).join(",")
    const url = githubReposParam
      ? `/projects?githubRepos=${encodeURIComponent(githubReposParam)}`
      : "/projects"

    router.push(url)
  }

  // Handle contact navigation with loading state
  const handleContactNavigation = async () => {
    setIsNavigatingToContact(true)
    setContactLoading(true)

    // Small delay to show the loading state
    await new Promise((resolve) => setTimeout(resolve, 500))

    router.push("/contact")
  }

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
        <Suspense fallback={null}>
          <PixelBlast
            variant="circle"
            pixelSize={4}
            color="#A855F7"
            patternScale={2}
            patternDensity={0.8}
            pixelSizeJitter={0.3}
            enableRipples={false}
            liquid={false}
            speed={0.3}
            edgeFade={0.15}
            transparent
          />
        </Suspense>
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-300 bg-purple-900/10" />

      <main
        className="relative z-10 w-screen overflow-hidden p-1"
        style={{ height: "100dvh" }}
      >
        {/* Mobile: 6x6 Grid, Tablet: 8x5, Desktop: 8x6 Grid */}
        <div
          className="relative grid grid-cols-6 grid-rows-6 md:grid-cols-8 md:grid-rows-5 lg:grid-rows-6 p-2"
          style={{
            gap: "10px",
            padding: "6px",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Description Box - Mobile: 2x3, Tablet: 6x3, Desktop: 6x4 */}
          <div className="col-span-3 row-span-3 col-start-1 row-start-1 md:col-span-5 md:row-span-3 lg:col-span-5 lg:row-span-4 md:col-start-1 md:row-start-2 lg:row-start-2 rounded-2xl md:rounded-3xl border-2 p-1 md:p-4 lg:p-6 flex flex-col z-10 group hover:border-transparent transition-all duration-300 hover:bg-opacity-80 relative backdrop-blur-sm bg-[#0F0F0F]/80 border-purple-500/20">
            <h2 className="text-[14px] md:text-xl lg:text-2xl font-bold mb-0.5 md:mb-3 lg:mb-4 pointer-events-none relative z-0">
              About Me
            </h2>
            <div className="leading-tight md:leading-relaxed overflow-y-auto scrollbar-hide flex-1 font-light text-[11px] md:text-sm lg:text-base xl:text-lg tracking-wide relative z-0 text-white/80">
              {loading ? (
                <SkeletonText lines={4} />
              ) : userData?.bio ? (
                <Suspense
                  fallback={
                    <div className="text-white/60 animate-pulse">
                      Loading...
                    </div>
                  }
                >
                  <TextType
                    text={userData.bio}
                    as="h2"
                    typingSpeed={80}
                    pauseDuration={2000}
                    showCursor={true}
                    cursorCharacter="|"
                    cursorClassName="text-purple-400"
                    loop={true}
                  />
                </Suspense>
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
              <Image
                src={userData?.profilePictureUrl || "/images/man.png"}
                alt={userData?.fullName || "Profile"}
                fill
                className="object-cover pointer-events-none relative z-0"
              />
            )}
          </div>

          {/* Tech Logos Strip - Mobile: 3x1, Tablet: 6x1, Desktop: 6x1 */}
          <div className="col-span-3 row-span-1 col-start-1 row-start-5 md:col-span-6 md:row-span-1 md:col-start-1 md:row-start-1 lg:col-start-1 lg:row-start-1 rounded-2xl md:rounded-3xl border-2 overflow-hidden relative z-10 group hover:border-transparent transition-all duration-300 backdrop-blur-sm bg-[#0F0F0F]/80 border-purple-500/20">
            <div className="flex items-center h-full px-0 md:px-6">
              {loading ? (
                <SkeletonTechLogos />
              ) : (
                <Suspense
                  fallback={
                    <div className="text-white/60 animate-pulse">
                      Loading tech stack...
                    </div>
                  }
                >
                  <LogoLoop logos={getTechLogos(userData?.techStack || [])} />
                </Suspense>
              )}
            </div>
          </div>

          {/* LeetCode Button - Mobile: 3x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-3 row-span-1 col-start-2 row-start-4 md:col-span-2 md:row-start-5 lg:row-start-6 md:col-start-1 z-10">
            <Suspense
              fallback={<SkeletonNavigationButton className="h-full" />}
            >
              <LeetCodeButton
                leetcodeUsername={userData?.socialLinks?.leetcodeProfile || ""}
              />
            </Suspense>
          </div>

          {/* LinkedIn Button - Mobile: 3x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-3 row-span-1 col-start-4 row-start-5 md:col-span-2 md:row-start-5 lg:row-start-6 md:col-start-3 z-10">
            <Suspense
              fallback={<SkeletonNavigationButton className="h-full" />}
            >
              <LinkedInButton
                linkedinUrl={userData?.socialLinks?.linkedInProfile || ""}
              />
            </Suspense>
          </div>

          {/* GitHub Button - Mobile: 3x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-3 row-span-1 col-start-4 row-start-3 md:col-span-2 md:row-start-5 lg:row-start-6 md:col-start-5 z-10">
            <Suspense
              fallback={<SkeletonNavigationButton className="h-full" />}
            >
              <GitHubButton
                githubUsername={userData?.socialLinks?.githubProfile || ""}
              />
            </Suspense>
          </div>

          {/* Projects Button - Mobile: 2x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-2 row-span-1 col-start-5 row-start-4 md:col-span-2 md:row-start-4 lg:row-start-5 lg:col-start-7 md:col-start-7 z-10">
            <button
              onClick={handleProjectsNavigation}
              disabled={isNavigatingToProjects || projectsLoading}
              className="w-full h-full rounded-2xl lg:rounded-3xl border-2 p-0.5 lg:p-3 flex flex-col items-center justify-center transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-purple-500/15 border-purple-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isNavigatingToProjects || projectsLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mb-1"></div>
                  <div className="text-[11px] lg:text-sm font-light text-white/80">
                    Loading...
                  </div>
                </>
              ) : (
                <>
                  <div className="font-semibold text-[13px] lg:text-base group-hover:text-purple-400 transition-colors duration-300">
                    Projects
                  </div>
                  <div className="text-[11px] lg:text-sm font-light text-white/80">
                    Portfolio
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Contact Button - Mobile: 2x1, Tablet: 2x1, Desktop: 2x1 */}
          <div className="col-span-6 row-span-1 col-start-1 row-start-6 md:col-span-2 md:row-start-5 lg:row-start-6 lg:col-start-7 md:col-start-7 z-10">
            <button
              onClick={handleContactNavigation}
              disabled={isNavigatingToContact || contactLoading}
              className="w-full h-full rounded-2xl lg:rounded-3xl border-2 p-0.5 lg:p-3 flex flex-col items-center justify-center transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-purple-600/15 border-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isNavigatingToContact || contactLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mb-1"></div>
                  <div className="text-[11px] lg:text-sm font-light text-white/80">
                    Loading...
                  </div>
                </>
              ) : (
                <>
                  <div className="font-semibold text-[13px] lg:text-base group-hover:text-purple-400 transition-colors duration-300">
                    Contact
                  </div>
                  <div className="text-[11px] lg:text-sm font-light text-white/80">
                    Get in Touch
                  </div>
                </>
              )}
            </button>
          </div>

          {/* PDF Button - Mobile: 2x1, Tablet: 1x1, Desktop: 1x1 */}
          <div className="col-span-1 row-span-1 col-start-1 row-start-4 md:col-span-1 md:row-span-2 md:row-start-2 md:col-start-6  lg:col-span-1 lg:row-span-2 lg:col-start-6 lg:row-start-4 z-10">
            <button
              onClick={() => window.open("/resume", "_blank")}
              className="w-full h-full rounded-2xl lg:rounded-3xl border-2 p-0.5 lg:p-3 flex flex-col items-center justify-center transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-purple-700/15 border-purple-600/40 hover:bg-purple-600/20"
            >
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400 group-hover:text-purple-300 mb-1 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9h4M10 13h4M10 17h4"
                  />
                </svg>
                <div className="font-semibold text-[11px] lg:text-sm group-hover:text-purple-400 transition-colors duration-300 text-center">
                  See PDF
                </div>
                <div className="text-[9px] lg:text-xs font-light text-white/60 text-center">
                  Resume
                </div>
              </div>
            </button>
          </div>

          {/* Cubes Animation - Mobile: 2x1, Tablet: 1x1, Desktop: 1x1 */}
          <div className="md:col-span-1 md:row-span-1 md:col-start-6 md:row-start-4 lg:col-span-1 lg:row-span-2 lg:col-start-6 lg:row-start-2 rounded-2xl md:rounded-3xl border-2 overflow-hidden z-10 group hover:border-transparent transition-all duration-300 backdrop-blur-sm bg-[#0F0F0F]/80 border-purple-500/20 hidden md:block">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-white/60 animate-pulse">Loading...</div>
                </div>
              }
            >
              <Cubes
                gridSize={6}
                maxAngle={45}
                radius={3}
                borderStyle="1px dashed #A855F7"
                faceColor="#1a0b2e"
                rippleColor="#ff6b6b"
                rippleSpeed={1.5}
                autoAnimate={true}
                rippleOnClick={true}
              />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
