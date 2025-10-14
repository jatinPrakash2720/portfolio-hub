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
      className={`bg-white/5 rounded-lg border border-white/10 transition-all duration-700 ease-in-out opacity-100 ${className}`}
      style={{
        animation: "fadeInOut 2s ease-in-out infinite",
      }}
    >
      {/* Browser header */}
      <div className="h-8 bg-white/10 rounded-t-lg flex items-center px-3 gap-2 transition-all duration-500 ease-in-out">
        <div className="w-3 h-3 bg-white/20 rounded-full animate-pulse" />
        <div
          className="w-3 h-3 bg-white/20 rounded-full animate-pulse"
          style={{ animationDelay: "0.1s" }}
        />
        <div
          className="w-3 h-3 bg-white/20 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="flex-1 h-4 bg-white/10 rounded ml-4 animate-pulse"
          style={{ animationDelay: "0.3s" }}
        />
      </div>

      {/* Content area with better positioning */}
      <div className="p-4 space-y-4 h-full">
        {/* Title area */}
        <div className="space-y-2">
          <div
            className="h-5 bg-white/10 rounded w-2/3 animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
          <div
            className="h-4 bg-white/5 rounded w-1/3 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 bg-white/5 rounded-lg p-4 space-y-3 transition-all duration-500 ease-in-out">
          <div
            className="h-4 bg-white/10 rounded w-full animate-pulse"
            style={{ animationDelay: "0.6s" }}
          />
          <div
            className="h-4 bg-white/10 rounded w-4/5 animate-pulse"
            style={{ animationDelay: "0.7s" }}
          />
          <div
            className="h-4 bg-white/10 rounded w-3/5 animate-pulse"
            style={{ animationDelay: "0.8s" }}
          />

          {/* Content blocks */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div
              className="h-20 bg-white/5 rounded animate-pulse"
              style={{ animationDelay: "0.9s" }}
            />
            <div
              className="h-20 bg-white/5 rounded animate-pulse"
              style={{ animationDelay: "1.0s" }}
            />
          </div>

          <div
            className="h-24 bg-white/5 rounded mt-3 animate-pulse"
            style={{ animationDelay: "1.1s" }}
          />
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
      <div className="flex-1 overflow-hidden p-2">
        <div className="space-y-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 ease-in-out"
            >
              <div
                className="w-8 h-8 bg-white/10 rounded-lg flex-shrink-0 animate-pulse"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              />
              <div className="flex-1 space-y-1">
                <div
                  className="h-3 bg-white/10 rounded w-3/4 animate-pulse"
                  style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                />
                <div
                  className="h-2 bg-white/5 rounded w-1/2 animate-pulse"
                  style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                />
              </div>
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
      className={`hidden lg:block overflow-hidden h-full relative transition-all duration-500 ease-in-out ${className}`}
    >
      <div className="flex h-full gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 h-full rounded-2xl lg:rounded-3xl overflow-hidden bg-black/80 backdrop-blur-sm transition-all duration-500 ease-in-out"
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
                className="w-2 h-2 bg-purple-500/20 rounded-full animate-pulse"
                style={{ animationDelay: `${0.6 + i * 0.1}s` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
