// Simple domain to username mapping
const DOMAIN_MAP = new Map([
  [
    "portfolio.jatinbuilds.com",
    { username: "jatin", displayName: "Jatin Prakash" },
  ],
  [
    "himanshu.portfolio.jatinbuilds.com",
    { username: "himanshu", displayName: "Himanshu" },
  ],
  [
    "jatin.portfolio.jatinbuilds.com",
    { username: "jatin", displayName: "Jatin Prakash" },
  ],
  // Add more mappings as needed
])

export function getDomainInfo(host: string) {
  // Remove port if present
  const hostWithoutPort = host.split(":")[0]

  // Check direct mapping first
  if (DOMAIN_MAP.has(hostWithoutPort)) {
    return DOMAIN_MAP.get(hostWithoutPort)!
  }

  // For localhost development
  if (hostWithoutPort.includes("localhost")) {
    const parts = hostWithoutPort.split(".")
    if (parts.length >= 2 && parts[0] !== "localhost") {
      return { username: parts[0], displayName: parts[0] }
    }
  }

  // Default fallback
  return { username: "jatin", displayName: "Jatin Prakash" }
}
