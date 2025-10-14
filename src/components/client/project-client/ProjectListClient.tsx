"use client"

import { useState, lazy, Suspense } from "react"

// Lazy load UI components
const AnimatedList = lazy(() => import("../../ui/ai-element/animate-list"))

type ProjectListClientProps = {
  projectTitles: string[]
  repoUrls: string[]
  onProjectSelect: (projectId: string, index: number) => void
  hasProjects: boolean
}

export default function ProjectListClient({
  projectTitles,
  repoUrls,
  onProjectSelect,
  hasProjects,
}: ProjectListClientProps) {
  const handleSelect = (name: string, index: number) => {
    // Always open GitHub repo when clicked, since we're showing GitHub repos in the list
    const repoUrl = repoUrls[index]
    console.log("Clicked repo:", name, "at index:", index)
    console.log("Repo URL:", repoUrl)
    console.log("All repo URLs:", repoUrls)

    if (repoUrl) {
      window.open(repoUrl, "_blank")
    } else {
      console.error("No URL found for repo at index:", index)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 md:p-3 border-b border-purple-500/20">
        <div className="flex items-center justify-center">
          <h3 className="text-sm md:text-base font-bold text-center">
            Major Github Repositories
            <span className="ml-2 text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
              {projectTitles.length}
            </span>
          </h3>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-hide">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-purple-400">
                  Loading projects...
                </div>
              </div>
            }
          >
            <AnimatedList items={projectTitles} onItemSelect={handleSelect} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
