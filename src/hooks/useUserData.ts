"use client"

import { useState, useEffect } from "react"
import { User } from "@/models/User"

interface UseUserDataReturn {
  userData: User | null
  loading: boolean
  error: string | null
}

export function useUserData(username: string): UseUserDataReturn {
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("=== useUserData useEffect triggered ===")
    console.log("Username:", username)

    if (!username) {
      console.log("No username, stopping loading")
      setUserData(null)
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchUserData = async () => {
      try {
        console.log("Starting API call for:", username)
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/users/${username}`)
        console.log("API response status:", response.status, response.ok)

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("API response data received:", data)
        console.log("Is component mounted?", isMounted)

        if (isMounted) {
          console.log("Setting userData and stopping loading")
          setUserData(data)
          setLoading(false)
          console.log("State updated successfully")
        } else {
          console.log("Component unmounted, skipping state update")
        }
      } catch (err) {
        console.error("Error in fetchUserData:", err)
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch user data"
          )
          setLoading(false)
        }
      }
    }

    fetchUserData()

    return () => {
      console.log("useEffect cleanup - component unmounting")
      isMounted = false
    }
  }, [username])

  console.log("useUserData returning:", {
    loading,
    hasUserData: !!userData,
    hasError: !!error,
  })

  return { userData, loading, error }
}
