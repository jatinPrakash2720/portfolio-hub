"use client"

import { useEffect, useRef } from "react"
import { SimpleProject } from "@/models/Project"

type FeaturedProjectsClientProps = {
  projects: SimpleProject[]
  selectedProjectId?: string
  onProjectClick: (projectId: string) => void
}

export default function FeaturedProjectsClient({
  projects,
  selectedProjectId,
  onProjectClick,
}: FeaturedProjectsClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  // Create seamless infinite scroll
  useEffect(() => {
    if (projects.length <= 3 || !scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollContent = container.querySelector(
      ".scroll-content"
    ) as HTMLElement
    if (!scrollContent) return

    let scrollPosition = 0
    const scrollSpeed = 0.3 // pixels per frame (slower for smoother effect)
    // Calculate based on: Featured container = 6 cols, but each item should be 1 col (same as Profile)
    // So 6 columns / 6 items visible = each item is 1/6 of container width
    const containerWidth = container.offsetWidth || 0
    const itemWidth = containerWidth / 6 + 5 // 1 column width + 5px gap
    const totalWidth = itemWidth * projects.length // Width of one complete set

    const animate = () => {
      scrollPosition += scrollSpeed

      // Use modulo to create seamless loop without reset
      const normalizedPosition = scrollPosition % totalWidth
      scrollContent.style.transform = `translateX(-${normalizedPosition}px)`
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    // Pause on hover
    const handleMouseEnter = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    const handleMouseLeave = () => {
      animationRef.current = requestAnimationFrame(animate)
    }

    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [projects.length, projects])

  if (projects.length === 0) return null

  // Create multiple copies for seamless loop (3 copies to ensure smooth transition)
  const multipleProjects = [...projects, ...projects, ...projects]

  return (
    <div
      ref={scrollContainerRef}
      className="hidden lg:block col-span-6 row-span-1 row-start-6 overflow-hidden h-full relative"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div
        className="scroll-content flex h-full"
        style={{
          width: "max-content",
          gap: "5px",
        }}
      >
        {multipleProjects.map((project, index) => (
          <div
            key={`${project.id}-${index}`}
            className="flex-shrink-0 h-full"
            style={{
              flex: "0 0 calc(16.666% - 5px)", // 1/6 of container (1 column) minus gap
              minWidth: "150px", // Minimum width
              maxWidth: "200px", // Maximum width
            }}
          >
            <div
              className="h-full rounded-2xl lg:rounded-3xl overflow-hidden bg-black/80 backdrop-blur-sm border-2 border-purple-500/20 cursor-pointer hover:border-purple-500/50 transition-all hover:scale-[1.02] group"
              onClick={() => onProjectClick(project.id || "")}
            >
              <div className="relative h-full p-3 flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-purple-900/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-400">
                    {project.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm group-hover:text-purple-400 transition-colors truncate">
                    {project.title}
                  </h4>
                  <p className="text-xs text-white/60 truncate">
                    {project.technologies[0] || "Project"}
                  </p>
                </div>
                {selectedProjectId === project.id && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
