interface SkeletonProps {
  className?: string
  lines?: number
}

export function SkeletonText({ lines = 1, className = "" }: SkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-white/10 rounded animate-pulse ${
            i === lines - 1 ? "w-3/4" : "w-full"
          }`}
        />
      ))}
    </div>
  )
}

export function SkeletonProfile({ className = "" }: SkeletonProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/10 rounded-full animate-pulse" />
      <div className="w-24 h-4 bg-white/10 rounded animate-pulse mt-3" />
    </div>
  )
}

export function SkeletonTechLogos({ className = "" }: SkeletonProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-8 h-8 bg-white/10 rounded animate-pulse" />
      ))}
    </div>
  )
}

export function SkeletonWebPreview({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`flex size-full flex-col rounded-lg bg-black/80 backdrop-blur-sm border-purple-500/20 overflow-hidden relative w-full ${className}`}
      style={{
        border: "1px solid rgba(147, 51, 234, 0.2)",
      }}
    >
      {/* Browser header */}
      <div className="flex items-center gap-1 p-2 bg-black/50 rounded-t-lg border-b border-purple-500/20">
        <div className="flex items-center gap-1 mr-2">
          <div className="h-4 w-4 bg-white/10 rounded-full animate-pulse" />
          <div
            className="h-4 w-4 bg-white/10 rounded-full animate-pulse"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="h-4 w-4 bg-white/10 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
        <div
          className="flex-1 h-8 bg-black/30 border border-purple-500/30 rounded animate-pulse"
          style={{ animationDelay: "0.3s" }}
        />
        <div className="flex items-center gap-1 ml-2">
          <div
            className="h-7 w-16 bg-white/5 rounded-lg animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
          <div
            className="h-8 w-8 bg-white/5 rounded animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden animate-pulse bg-white/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-white/60 text-sm">Loading preview...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonProjectList({ className = "" }: SkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded">
          <div className="w-8 h-8 bg-white/10 rounded" />
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-white/10 rounded w-3/4" />
            <div className="h-2 bg-white/5 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonFeaturedProjects({ className = "" }: SkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white/5 rounded-lg p-3">
          <div className="h-20 bg-white/10 rounded mb-2" />
          <div className="h-3 bg-white/10 rounded w-2/3 mb-1" />
          <div className="h-2 bg-white/5 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonNavigationButton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-white/5 rounded-lg border border-white/10 p-3 flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-6 h-6 bg-white/10 rounded mb-1" />
      <div className="h-3 bg-white/10 rounded w-16 mb-1" />
      <div className="h-2 bg-white/5 rounded w-12" />
    </div>
  )
}

// Custom skeletons for specific components
export function SkeletonProjectListClient({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`h-full flex flex-col transition-all duration-500 ease-in-out ${className}`}
    >
      {/* Header */}
      <div className="p-2 md:p-3 border-b border-purple-500/20 transition-all duration-500 ease-in-out">
        <div className="flex items-center justify-center">
          <div className="h-4 bg-white/10 rounded w-40 animate-pulse" />
          <div
            className="ml-2 w-6 h-4 bg-purple-500/20 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      </div>

      {/* List items with better spacing */}
      <div className="flex-1 overflow-hidden p-2 md:p-3 lg:p-4">
        <div className="space-y-2 md:space-y-3 lg:space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-black/60 backdrop-blur-sm border border-purple-500/20 rounded-lg transition-all duration-200 flex items-center justify-center py-2 md:py-3 lg:py-4 animate-pulse"
              style={{
                minHeight: "44px",
                height: "auto",
                animationDelay: `${0.3 + i * 0.1}s`,
              }}
            >
              <div
                className="text-white m-0 font-medium text-xs md:text-sm lg:text-base text-center capitalize bg-white/10 rounded w-3/4 animate-pulse"
                style={{
                  animationDelay: `${0.4 + i * 0.1}s`,
                  height: "1em",
                  lineHeight: "1em",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkeletonFeaturedProjectsClient({
  className = "",
}: SkeletonProps) {
  return (
    <div
      className={`hidden lg:block col-span-6 row-span-1 row-start-6 overflow-hidden h-full relative w-full transition-all duration-500 ease-in-out ${className}`}
    >
      <div className="flex h-full gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 h-full rounded-2xl lg:rounded-3xl overflow-hidden bg-black/80 backdrop-blur-sm border-2 border-purple-500/20 transition-all duration-500 ease-in-out"
            style={{
              flex: "0 0 calc(16.666% - 5px)",
              minWidth: "150px",
              maxWidth: "200px",
            }}
          >
            <div className="relative h-full p-3 flex items-center gap-3">
              {/* Project icon placeholder */}
              <div
                className="w-16 h-16 rounded-lg bg-purple-900/20 flex items-center justify-center flex-shrink-0 animate-pulse"
                style={{ animationDelay: `${0.2 + i * 0.1}s` }}
              >
                <div
                  className="w-8 h-8 bg-white/10 rounded animate-pulse"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                />
              </div>
              {/* Project details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div
                  className="h-3 bg-white/10 rounded w-3/4 animate-pulse"
                  style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                />
                <div
                  className="h-2 bg-white/5 rounded w-1/2 animate-pulse"
                  style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                />
              </div>
              {/* Selection indicator placeholder */}
              <div
                className="absolute top-2 right-2 w-2 h-2 bg-purple-500/20 rounded-full animate-pulse"
                style={{ animationDelay: `${0.6 + i * 0.1}s` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
