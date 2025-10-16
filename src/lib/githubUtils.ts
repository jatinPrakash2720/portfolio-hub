/**
 * Extracts repository name from GitHub URL
 * @param url - GitHub repository URL
 * @returns Repository name or fallback
 */
export function extractRepoName(url: string): string {
  try {
    // Handle different GitHub URL formats
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)(?:\/.*)?$/, // github.com/owner/repo
      /github\.com\/([^\/]+)\/([^\/]+)\.git$/, // github.com/owner/repo.git
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[2] // Return the repository name
      }
    }

    // If no pattern matches, return the last part of the URL
    const parts = url.split("/").filter(Boolean)
    return parts[parts.length - 1] || "Unknown Repo"
  } catch (error) {
    return "Unknown Repo"
  }
}

/**
 * Extracts repository owner from GitHub URL
 * @param url - GitHub repository URL
 * @returns Repository owner or empty string
 */
export function extractRepoOwner(url: string): string {
  try {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    return match ? match[1] : ""
  } catch (error) {
    return ""
  }
}

/**
 * Validates if a URL is a valid GitHub repository URL
 * @param url - URL to validate
 * @returns boolean indicating if URL is valid
 */
export function isValidGitHubUrl(url: string): boolean {
  try {
    return /^https?:\/\/github\.com\/[^\/]+\/[^\/]+/.test(url)
  } catch {
    return false
  }
}
