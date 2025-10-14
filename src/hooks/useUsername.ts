import { useEffect, useState } from "react"

export function useUsername(): string | null {
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    // Extract username from subdomain on client side
    if (typeof window !== "undefined") {
      const host = window.location.host
      const extractedUsername = extractSubdomain(host)
      setUsername(extractedUsername)
    }
  }, [])

  return username
}

function extractSubdomain(host: string): string | null {
  // Remove port if present
  const hostWithoutPort = host.split(":")[0]

  // Split by dots
  const parts = hostWithoutPort.split(".")

  // For localhost development, check if it's subdomain.localhost
  if (hostWithoutPort.includes("localhost")) {
    if (parts.length >= 2 && parts[0] !== "localhost") {
      return parts[0]
    }
    return null
  }

  // For production domains like portfolio.jatinbuilds.com
  // We expect: subdomain.portfolio.jatinbuilds.com
  if (parts.length >= 3) {
    // Check if the second part is 'portfolio' (our main domain)
    if (parts[1] === "portfolio") {
      return parts[0]
    }
  }

  // For direct portfolio.jatinbuilds.com access, extract jatin from jatinbuilds
  if (parts.length === 2 && parts[0] === "portfolio") {
    // Extract username from domain like jatinbuilds.com -> jatin
    const domainPart = parts[1].split(".")[0] // jatinbuilds
    return domainPart.replace("builds", "") // jatin
  }

  return null
}
