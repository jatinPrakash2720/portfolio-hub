"use client"

import React, { lazy, Suspense, useEffect } from "react"
import { SimpleProject } from "@/models/Project"

const WebPreview = lazy(() =>
  import("../../ui/ai-element/web-preview").then((mod) => ({
    default: mod.WebPreview,
  }))
)
const WebPreviewNavigation = lazy(() =>
  import("../../ui/ai-element/web-preview").then((mod) => ({
    default: mod.WebPreviewNavigation,
  }))
)
const WebPreviewUrl = lazy(() =>
  import("../../ui/ai-element/web-preview").then((mod) => ({
    default: mod.WebPreviewUrl,
  }))
)
const WebPreviewBody = lazy(() =>
  import("../../ui/ai-element/web-preview").then((mod) => ({
    default: mod.WebPreviewBody,
  }))
)

type WebPreviewClientProps = {
  selectedProject: SimpleProject
  handleDescriptionClick?: () => void
  setIsWebPreviewLoaded: (isWebPreviewLoaded: boolean) => void
  onPreviousProject?: () => void
  onNextProject?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
  showProjectNavigation?: boolean
}

const WebPreviewClient = ({
  selectedProject,
  handleDescriptionClick,
  setIsWebPreviewLoaded,
  onPreviousProject,
  onNextProject,
  hasPrevious,
  hasNext,
  showProjectNavigation,
}: WebPreviewClientProps) => {
  // Fallback timeout to hide loader if iframe doesn't fire onLoad
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("Fallback timeout: Hiding loading spinner")
      setIsWebPreviewLoaded(true)
    }, 5000) // Hide loader after 5 seconds max

    return () => clearTimeout(timeout)
  }, [selectedProject.liveUrl, setIsWebPreviewLoaded])

  const handleIframeLoad = () => {
    console.log("Iframe loaded successfully")
    setIsWebPreviewLoaded(true)
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full bg-black/50">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WebPreview
        defaultUrl={selectedProject.liveUrl}
        style={{ height: "100%" }}
        onPreviousProject={onPreviousProject}
        onNextProject={onNextProject}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        showProjectNavigation={showProjectNavigation}
      >
        <WebPreviewNavigation onDescriptionClick={handleDescriptionClick}>
          <WebPreviewUrl value={selectedProject.liveUrl} />
        </WebPreviewNavigation>
        <WebPreviewBody
          src={selectedProject.liveUrl}
          onLoad={handleIframeLoad}
        />
      </WebPreview>
    </Suspense>
  )
}

export default WebPreviewClient
