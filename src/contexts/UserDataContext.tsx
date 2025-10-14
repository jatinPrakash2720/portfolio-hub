"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { User } from "@/models/User"

interface UserDataContextType {
  userData: User | null
  loading: boolean
  error: string | null
  projectsLoading: boolean
  contactLoading: boolean
  introLoading: boolean
  username: string | null
  prefetchUserData: (username: string) => Promise<void>
  setProjectsLoading: (loading: boolean) => void
  setContactLoading: (loading: boolean) => void
  setIntroLoading: (loading: boolean) => void
  setUsername: (username: string | null) => void
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
)

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)
  const [introLoading, setIntroLoading] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  const prefetchUserData = async (username: string) => {
    if (userData || loading) {
      console.log("Data already loaded or loading, skipping prefetch")
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log("Prefetching user data for:", username)

      const response = await fetch(`/api/users/${username}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("User data prefetched successfully:", data)

      setUserData(data)
      setLoading(false)
    } catch (err) {
      console.error("Error prefetching user data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch user data")
      setLoading(false)
    }
  }

  return (
    <UserDataContext.Provider
      value={{
        userData,
        loading,
        error,
        projectsLoading,
        contactLoading,
        introLoading,
        username,
        prefetchUserData,
        setProjectsLoading,
        setContactLoading,
        setIntroLoading,
        setUsername,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

export function useUserDataContext() {
  const context = useContext(UserDataContext)
  if (context === undefined) {
    throw new Error("useUserDataContext must be used within a UserDataProvider")
  }
  return context
}
