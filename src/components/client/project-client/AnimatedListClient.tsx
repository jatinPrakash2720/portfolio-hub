"use client"

import AnimatedList from "@/components/ui/ai-element/animate-list"
import React, { Suspense } from "react"

const AnimatedListClient = ({
  projectNames,
  handleProjectSelect,
}: {
  projectNames: string[]
  handleProjectSelect: (name: string, index: number) => void
}) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-purple-400">
            Loading projects...
          </div>
        </div>
      }
    >
      <AnimatedList
        items={projectNames}
        onItemSelect={handleProjectSelect}
        showGradients={true}
        enableArrowNavigation={true}
        displayScrollbar={true}
        initialSelectedIndex={0}
        className="h-full text-xs"
        itemClassName="p-2 md:p-3 lg:p-4"
      />
    </Suspense>
  )
}

export default AnimatedListClient
