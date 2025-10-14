"use client"

import React, { useEffect, useState, lazy, Suspense } from "react"
import { extractRepoName } from "@/lib/githubUtils"
import { useUserDataContext } from "@/contexts/UserDataContext"
import { useRouter } from "next/navigation"
import {
  SkeletonWebPreview,
  SkeletonProjectListClient,
  SkeletonFeaturedProjectsClient,
  SkeletonNavigationButton,
} from "../ui/skeleton-loading"

// Lazy load UI components
const PixelBlast = lazy(() => import("../ui/PixelBlast"))
const WebPreview = lazy(() =>
  import("../ui/ai-element/web-preview").then((mod) => ({
    default: mod.WebPreview,
  }))
)
const WebPreviewNavigation = lazy(() =>
  import("../ui/ai-element/web-preview").then((mod) => ({
    default: mod.WebPreviewNavigation,
  }))
)
const WebPreviewUrl = lazy(() =>
  import("../ui/ai-element/web-preview").then((mod) => ({
    default: mod.WebPreviewUrl,
  }))
)
const WebPreviewBody = lazy(() =>
  import("../ui/ai-element/web-preview").then((mod) => ({
    default: mod.WebPreviewBody,
  }))
)
const FeaturedProjectsClient = lazy(
  () => import("../client/project-client/FeaturedProjectsClient")
)
const ProjectListClient = lazy(
  () => import("../client/project-client/ProjectListClient")
)

type ProjectsPageProps = {
  githubRepos?: string[]
}

interface Project {
  id: string
  title: string
  userId: string
  liveUrl: string
  sourceCodeUrl: string
  technologies: string[]
}

interface AllProject {
  projects: Project[]
}

interface User {
  githubRepos?: string[]
}

export default function ProjectsPage({ githubRepos }: ProjectsPageProps) {
  const { setProjectsLoading, setIntroLoading, setContactLoading } =
    useUserDataContext()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [repoUrls, setRepoUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [isWebPreviewLoaded, setIsWebPreviewLoaded] = useState(false)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)
  const [isNavigatingToIntro, setIsNavigatingToIntro] = useState(false)
  const [isNavigatingToContact, setIsNavigatingToContact] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch projects from API
        const projectsResponse = await fetch("/api/projects/jatin")
        console.log("Projects response status:", projectsResponse.status)
        console.log(
          "Projects response headers:",
          Object.fromEntries(projectsResponse.headers.entries())
        )

        if (!projectsResponse.ok) {
          const errorText = await projectsResponse.text()
          console.error("Projects API error:", errorText)
          throw new Error(
            `Failed to fetch projects: ${projectsResponse.status}`
          )
        }

        let projectsData: AllProject
        try {
          const responseText = await projectsResponse.text()
          console.log(
            "Raw projects response:",
            responseText.substring(0, 200) + "..."
          )
          projectsData = JSON.parse(responseText)
          console.log("Projects Data:", projectsData)
        } catch (jsonError) {
          console.error("JSON parsing error for projects:", jsonError)
          throw new Error("Invalid JSON response from projects API")
        }
        setProjects(projectsData?.projects || [])

        // Get GitHub repos from props or fetch from user data
        let repos: string[] = []
        if (githubRepos && githubRepos.length > 0) {
          repos = githubRepos
          console.log("GitHub repos from props:", githubRepos)
        } else {
          // Fallback: fetch user data to get GitHub repos
          const userResponse = await fetch("/api/users/jatin")
          if (userResponse.ok) {
            try {
              const userData: User = await userResponse.json()
              repos = userData?.githubRepos || []
              console.log("GitHub repos from user data:", userData?.githubRepos)
            } catch (jsonError) {
              console.error("JSON parsing error for user data:", jsonError)
              // Continue with empty repos array
            }
          }
        }
        setRepoUrls(repos)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data")
      } finally {
        setLoading(false)
        setProjectsLoading(false)
      }
    }

    fetchData()
  }, [githubRepos, setProjectsLoading])

  // Set initial selected project
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id)
    }
  }, [projects, selectedProjectId])

  // Responsive detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024) // lg breakpoint
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Extract repository names from GitHub URLs
  const repoNames = repoUrls.map((url) => extractRepoName(url))

  // Get current selected project
  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0]

  // Get featured projects (all except selected)
  const featuredProjects = projects.filter((p) => p.id !== selectedProjectId)

  // Get current project index
  const currentProjectIndex = projects.findIndex(
    (p) => p.id === selectedProjectId
  )

  const handleProjectSelect = (projectId: string) => {
    console.log("Project selected:", projectId)
    setSelectedProjectId(projectId)
    setIsWebPreviewLoaded(false)
  }

  // Navigation handlers
  const handlePreviousProject = () => {
    if (currentProjectIndex > 0) {
      const prevProject = projects[currentProjectIndex - 1]
      handleProjectSelect(prevProject.id || "")
    }
  }

  const handleNextProject = () => {
    if (currentProjectIndex < projects.length - 1) {
      const nextProject = projects[currentProjectIndex + 1]
      handleProjectSelect(nextProject.id || "")
    }
  }

  // Check if navigation is available
  const hasPrevious = currentProjectIndex > 0
  const hasNext = currentProjectIndex < projects.length - 1

  // Navigation handlers for intro and contact
  const handleIntroNavigation = async () => {
    setIsNavigatingToIntro(true)
    setIntroLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push("/intro")
  }

  const handleContactNavigation = async () => {
    setIsNavigatingToContact(true)
    setContactLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push("/contact")
  }

  if (loading) {
    return (
      <div className="h-screen flex relative transition-colors duration-300 bg-black text-white">
        {/* PixelBlast Background */}
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

        {/* Tint Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-300 bg-purple-900/10" />

        <main
          className="relative z-10 w-screen overflow-hidden p-1"
          style={{ height: "100dvh" }}
        >
          {/* Responsive Grid Layout */}
          <div
            className="relative grid grid-cols-6 grid-rows-7 md:grid-cols-8 md:grid-rows-5 lg:grid-rows-6 md:p-6 lg:p-10"
            style={{
              gap: "10px",
              padding: "6px",
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Web Preview Section Skeleton */}
            <div className="col-span-6 row-span-4 md:col-span-6 md:row-span-5 lg:row-span-5 rounded-2xl md:rounded-3xl overflow-hidden bg-black/80 backdrop-blur-sm border-2 border-purple-500/20 relative">
              <SkeletonWebPreview className="h-full" />
            </div>

            {/* Project List Sidebar Skeleton */}
            <div className="col-span-4 row-span-3 row-start-5 col-start-1 md:col-span-2 md:row-span-4 md:col-start-7 md:row-start-1 lg:col-span-2 lg:row-span-5 lg:col-start-7 lg:row-start-1 rounded-2xl md:rounded-3xl overflow-hidden bg-black/80 backdrop-blur-sm border-2 border-purple-500/20">
              <SkeletonProjectListClient className="h-full" />
            </div>

            {/* Featured Projects Skeleton - Desktop Only */}
            <SkeletonFeaturedProjectsClient className="col-span-6 row-span-1 row-start-6" />

            {/* Empty space for navigation buttons - will be filled by actual component */}
            <div className="col-span-2 row-span-2 row-start-6 md:col-span-1 md:row-span-1 md:col-start-7 md:row-start-5 lg:col-span-1 lg:row-span-1 lg:col-start-7 lg:row-start-6" />
            <div className="col-span-2 row-span-1 row-start-5 col-start-5 md:col-span-1 md:row-span-1 md:col-start-8 md:row-start-5 lg:col-span-1 lg:row-span-1 lg:col-start-8 lg:row-start-6" />
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Error</h2>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    )
  }

  // If no projects and no repos, show empty state
  if (projects.length === 0 && repoNames.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Projects Found</h2>
          <p className="text-white/60">Add some projects to get started!</p>
        </div>
      </div>
    )
  }

  const projectTitles = repoNames

  return (
    <>
      <style jsx>{`
        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes smoothFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .skeleton-to-content {
          animation: smoothFadeIn 0.6s ease-out;
        }
      `}</style>
      <div className="h-screen flex relative transition-colors duration-300 bg-black text-white">
        {/* PixelBlast Background */}
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

        {/* Tint Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-300 bg-purple-900/10" />

        <main
          className="relative z-10 w-screen overflow-hidden p-1"
          style={{ height: "100dvh" }}
        >
          {/* Responsive Grid Layout */}
          <div
            className="relative grid grid-cols-6 grid-rows-7 md:grid-cols-8 md:grid-rows-5 lg:grid-rows-6 md:p-6 lg:p-10"
            style={{
              gap: "10px",
              padding: "6px",
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Web Preview Section */}
            <div className="col-span-6 row-span-4 md:col-span-6 md:row-span-5 lg:row-span-5 rounded-2xl md:rounded-3xl overflow-hidden bg-black/80 backdrop-blur-sm border-2 border-purple-500/20 relative transition-all duration-500 ease-in-out">
              {/* Loading Spinner */}
              {!isWebPreviewLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-white/60 text-sm">Loading preview...</p>
                  </div>
                </div>
              )}

              {/* Web Preview */}
              <div className="h-full relative skeleton-to-content">
                <Suspense fallback={<SkeletonWebPreview className="h-full" />}>
                  <WebPreview
                    defaultUrl={selectedProject?.liveUrl}
                    style={{ height: "100%" }}
                    onPreviousProject={handlePreviousProject}
                    onNextProject={handleNextProject}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    showProjectNavigation={isMobileOrTablet}
                  >
                    <WebPreviewNavigation>
                      <WebPreviewUrl value={selectedProject?.liveUrl} />
                    </WebPreviewNavigation>
                    <WebPreviewBody
                      src={selectedProject?.liveUrl}
                      onLoad={() => setIsWebPreviewLoaded(true)}
                    />
                  </WebPreview>
                </Suspense>
              </div>
            </div>

            {/* Project List Sidebar */}
            <div className="col-span-4 row-span-3 row-start-5 col-start-1 md:col-span-2 md:row-span-4 md:col-start-7 md:row-start-1 lg:col-span-2 lg:row-span-5 lg:col-start-7 lg:row-start-1 rounded-2xl md:rounded-3xl overflow-hidden bg-black/80 backdrop-blur-sm border-2 border-purple-500/20 transition-all duration-500 ease-in-out">
              <div className="skeleton-to-content">
                <Suspense
                  fallback={<SkeletonProjectListClient className="h-full" />}
                >
                  <ProjectListClient
                    projectTitles={projectTitles}
                    repoUrls={repoUrls}
                    hasProjects={projects.length > 0}
                    onProjectSelect={(title, index) => {
                      const project = projects[index]
                      if (project?.id) {
                        handleProjectSelect(project.id)
                      }
                    }}
                  />
                </Suspense>
              </div>
            </div>

            {/* Featured Projects - Desktop Only */}
            <div className="col-span-6 row-span-1 row-start-6 skeleton-to-content">
              <Suspense
                fallback={<SkeletonFeaturedProjectsClient className="h-full" />}
              >
                <FeaturedProjectsClient
                  projects={featuredProjects}
                  selectedProjectId={selectedProject?.id}
                  onProjectClick={handleProjectSelect}
                />
              </Suspense>
            </div>

            {/* Profile Button */}
            <div className="col-span-2 row-span-2 row-start-6 md:col-span-1 md:row-span-1 md:col-start-7 md:row-start-5 lg:col-span-1 lg:row-span-1 lg:col-start-7 lg:row-start-6">
              <button
                onClick={handleIntroNavigation}
                disabled={isNavigatingToIntro}
                className="w-full h-full rounded-2xl md:rounded-2xl border-2 p-0.5 md:p-3 flex flex-col items-center justify-center transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-purple-500/15 border-purple-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigatingToIntro ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mb-1"></div>
                    <div className="text-[11px] md:text-xs font-light text-black/80">
                      Loading...
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-[13px] md:text-sm group-hover:text-purple-400 transition-colors duration-300">
                      Profile
                    </div>
                    <div className="text-[11px] md:text-xs font-light text-black/80">
                      About Me
                    </div>
                  </>
                )}
              </button>
            </div>

            {/* Contact Button */}
            <div className="col-span-2 row-span-1 row-start-5 col-start-5 md:col-span-1 md:row-span-1 md:col-start-8 md:row-start-5 lg:col-span-1 lg:row-span-1 lg:col-start-8 lg:row-start-6">
              <button
                onClick={handleContactNavigation}
                disabled={isNavigatingToContact}
                className="w-full h-full rounded-2xl md:rounded-2xl border-2 p-0.5 md:p-3 flex flex-col items-center justify-center transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-purple-600/15 border-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigatingToContact ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mb-1"></div>
                    <div className="text-[11px] md:text-xs font-light text-black/80">
                      Loading...
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-[13px] md:text-sm group-hover:text-purple-400 transition-colors duration-300">
                      Contact
                    </div>
                    <div className="text-[11px] md:text-xs font-light text-black/80">
                      Get in Touch
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
