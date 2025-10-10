interface LinkedInButtonProps {
  linkedinUrl: string
}

export function LinkedInButton({ linkedinUrl }: LinkedInButtonProps) {
  return (
    <a
      href={`https://www.linkedin.com/in/${linkedinUrl}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`h-full rounded-2xl lg:rounded-3xl border-2 p-2 lg:p-3 flex flex-col items-center justify-center transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-[#0F0F0F]/80 border-purple-500/20 hover:scale-105`}
    >
      <div className="flex items-center justify-between w-full px-2">
        <div className="w-8 h-8"></div> {/* Spacer */}
        <div className="font-semibold text-xs lg:text-base group-hover:text-purple-400 transition-colors duration-300">
          LinkedIn
        </div>
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-400/30 transition-all duration-300">
          <svg
            className="w-4 h-4 text-purple-400 group-hover:text-purple-300 group-hover:-rotate-15 transition-transform duration-300 ease-in-out"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ transformOrigin: "center" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </a>
  )
}
