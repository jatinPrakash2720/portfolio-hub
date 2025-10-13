interface SkeletonProps {
  className?: string
  lines?: number
}

export function SkeletonBox({ className = "" }: SkeletonProps) {
  return <div className={`bg-white/10 rounded animate-pulse ${className}`} />
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
