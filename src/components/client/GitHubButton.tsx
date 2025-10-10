"use client"

import { useState, useEffect } from "react"

interface GitHubButtonProps {
  githubUsername: string
}

interface GitHubData {
  public_repos: number
}

export function GitHubButton({ githubUsername }: GitHubButtonProps) {
  const [repoCount, setRepoCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${githubUsername}`
        )
        if (response.ok) {
          const data: GitHubData = await response.json()
          setRepoCount(data.public_repos)
        }
      } catch (error) {
        console.error("Failed to fetch GitHub data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [githubUsername])

  return (
    <a
      href={`https://github.com/${githubUsername}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`h-full rounded-2xl lg:rounded-3xl border-2 p-2 lg:p-3 flex flex-col items-center justify-center transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-[#0F0F0F]/80 border-purple-500/20 hover:scale-105`}
    >
      <div className="flex items-center justify-between w-full px-2">
        <div className="w-8 h-8"></div> {/* Spacer */}
        <div className="flex flex-col items-center">
          <div className="font-semibold text-xs lg:text-base group-hover:text-purple-400 transition-colors duration-300">
            GitHub
          </div>
          {!loading && repoCount !== null && (
            <div className="text-[10px] lg:text-xs text-purple-300/80 mt-1">
              {repoCount} repos
            </div>
          )}
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
