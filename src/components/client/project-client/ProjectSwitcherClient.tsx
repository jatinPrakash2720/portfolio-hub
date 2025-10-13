"use client"

import React, { useState, useEffect } from "react"
import { SimpleProject } from "@/models/Project"
import PixelBlastClient from "../intro-client/PixelBlastClient"
import WebPreviewClient from "./WebPreviewClient"
import FeaturedProjectsClient from "./FeaturedProjectsClient"
import ProjectListClient from "./ProjectListClient"
import Link from "next/link"

type ProjectSwitcherClientProps = {
  initialProjects: SimpleProject[]
  projectTitles: string[]
  repoUrls: string[]
}

export default function ProjectSwitcherClient({
  initialProjects,
  projectTitles,
  repoUrls,
}: ProjectSwitcherClientProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjects[0]?.id || ""
  )
  const [isWebPreviewLoaded, setIsWebPreviewLoaded] = useState(false)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)

  // Get current selected project
  const selectedProject =
    initialProjects.find((p) => p.id === selectedProjectId) ||
    initialProjects[0]

  // Get featured projects (all except selected)
  const featuredProjects = initialProjects.filter(
    (p) => p.id !== selectedProjectId
  )

  // Get current project index
  const currentProjectIndex = initialProjects.findIndex(
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
      const prevProject = initialProjects[currentProjectIndex - 1]
      handleProjectSelect(prevProject.id || "")
    }
  }

  const handleNextProject = () => {
    if (currentProjectIndex < initialProjects.length - 1) {
      const nextProject = initialProjects[currentProjectIndex + 1]
      handleProjectSelect(nextProject.id || "")
    }
  }

  // Check if navigation is available
  const hasPrevious = currentProjectIndex > 0
  const hasNext = currentProjectIndex < initialProjects.length - 1

  // Responsive detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024) // lg breakpoint
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Debug loading state changes
  React.useEffect(() => {
    console.log("WebPreview loaded state changed:", isWebPreviewLoaded)
  }, [isWebPreviewLoaded])

  return (
    <div className="h-screen flex relative transition-colors duration-300 bg-black text-white">
      {/* PixelBlast Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <PixelBlastClient />
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
          <div className="col-span-6 row-span-4 md:col-span-6 md:row-span-5 lg:row-span-5 rounded-2xl md:rounded-3xl overflow-hidden bg-black/80 backdrop-blur-sm border-2 border-purple-500/20 relative">
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
            <div className="h-full relative">
              <WebPreviewClient
                selectedProject={selectedProject}
                setIsWebPreviewLoaded={setIsWebPreviewLoaded}
                onPreviousProject={handlePreviousProject}
                onNextProject={handleNextProject}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
                showProjectNavigation={isMobileOrTablet}
              />
            </div>
          </div>

          {/* Project List Sidebar */}
          <div className="col-span-4 row-span-3 row-start-5 col-start-1 md:col-span-2 md:row-span-4 md:col-start-7 md:row-start-1 lg:col-span-2 lg:row-span-5 lg:col-start-7 lg:row-start-1 rounded-2xl md:rounded-3xl overflow-hidden bg-black/80 backdrop-blur-sm border-2 border-purple-500/20">
            <ProjectListClient
              projectTitles={projectTitles}
              repoUrls={repoUrls}
              hasProjects={initialProjects.length > 0}
              onProjectSelect={(title, index) => {
                const project = initialProjects[index]
                if (project?.id) {
                  handleProjectSelect(project.id)
                }
              }}
            />
          </div>

          {/* Featured Projects - Desktop Only */}
          <FeaturedProjectsClient
            projects={featuredProjects}
            selectedProjectId={selectedProject.id}
            onProjectClick={handleProjectSelect}
          />

          {/* Profile Button */}
          <div className="col-span-2 row-span-2 row-start-6 md:col-span-1 md:row-span-1 md:col-start-7 md:row-start-5 lg:col-span-1 lg:row-span-1 lg:col-start-7 lg:row-start-6">
            <Link href="/intro">
              <button className="w-full h-full rounded-2xl md:rounded-2xl border-2 p-0.5 md:p-3 flex flex-col items-center justify-center transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-purple-500/15 border-purple-400/40">
                <div className="font-semibold text-[13px] md:text-sm group-hover:text-purple-400 transition-colors duration-300">
                  Profile
                </div>
                <div className="text-[11px] md:text-xs font-light text-white/80">
                  About Me
                </div>
              </button>
            </Link>
          </div>

          {/* Contact Button */}
          <div className="col-span-2 row-span-1 row-start-5 col-start-5 md:col-span-1 md:row-span-1 md:col-start-8 md:row-start-5 lg:col-span-1 lg:row-span-1 lg:col-start-8 lg:row-start-6">
            <Link href="/contact">
              <button className="w-full h-full rounded-2xl md:rounded-2xl border-2 p-0.5 md:p-3 flex flex-col items-center justify-center transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-purple-600/15 border-purple-500/40">
                <div className="font-semibold text-[13px] md:text-sm group-hover:text-purple-400 transition-colors duration-300">
                  Contact
                </div>
                <div className="text-[11px] md:text-xs font-light text-white/80">
                  Get in Touch
                </div>
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
