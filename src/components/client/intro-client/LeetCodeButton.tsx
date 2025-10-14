"use client"

import { useState, useEffect } from "react"

interface LeetCodeButtonProps {
  leetcodeUsername: string
}

interface LeetCodeData {
  totalSolved: number
}

export function LeetCodeButton({ leetcodeUsername }: LeetCodeButtonProps) {
  const [problemsSolved, setProblemsSolved] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeetCodeData = async () => {
      if (!leetcodeUsername) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `https://leetcode-stats-api.vercel.app/${leetcodeUsername}`
        )

        if (!response.ok) {
          console.warn(
            `LeetCode API returned ${response.status}: ${response.statusText}`
          )
          return
        }

        const responseText = await response.text()
        console.log(
          "LeetCode API response:",
          responseText.substring(0, 200) + "..."
        )

        // Check if response is HTML instead of JSON
        if (responseText.trim().startsWith("<")) {
          console.warn("LeetCode API returned HTML instead of JSON")
          return
        }

        const data: LeetCodeData = JSON.parse(responseText)
        setProblemsSolved(data.totalSolved)
      } catch (error) {
        console.error("Failed to fetch LeetCode data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeetCodeData()
  }, [leetcodeUsername])

  return (
    <a
      href={`https://leetcode.com/${leetcodeUsername}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`h-full rounded-2xl lg:rounded-3xl border-2 p-2 lg:p-3 flex flex-col items-center justify-center transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-[#0F0F0F]/80 border-purple-500/20 `}
    >
      <div className="flex items-center justify-between w-full px-2">
        <div className="w-8 h-8"></div> {/* Spacer */}
        <div className="flex flex-col items-center">
          <div className="font-semibold text-xs lg:text-base group-hover:text-purple-400 transition-colors duration-300">
            LeetCode
          </div>
          {!loading && problemsSolved !== null && (
            <div className="text-[10px] lg:text-xs text-purple-300/80 mt-1">
              {problemsSolved} solved
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
