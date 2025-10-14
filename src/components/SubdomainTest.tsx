"use client"

import { useUsername } from "@/hooks/useUsername"
import { useUserDataContext } from "@/contexts/UserDataContext"

export default function SubdomainTest() {
  const extractedUsername = useUsername()
  const { username } = useUserDataContext()

  if (process.env.NODE_ENV !== "development") {
    return null // Only show in development
  }

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50">
      <div>Extracted Username: {extractedUsername || "None"}</div>
      <div>Context Username: {username || "None"}</div>
      <div>
        Current Host:{" "}
        {typeof window !== "undefined" ? window.location.host : "N/A"}
      </div>
    </div>
  )
}
