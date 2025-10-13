import React from "react"
import ProjectSwitcherClient from "../client/project-client/ProjectSwitcherClient"
import { getAllProjectsSelective } from "@/services/projectServices"
import { getUser } from "@/services/userServices"
import { extractRepoName } from "@/lib/githubUtils"

type ProjectsPageProps = {
  githubRepos?: string[]
}

export default async function ProjectsPage({ githubRepos }: ProjectsPageProps) {
  // Fetch projects from Firebase
  const projectsData = await getAllProjectsSelective("jatin")
  console.log("Projects Data:", projectsData)

  // Fallback to empty array if no projects
  const projects = projectsData?.projects || []

  // Get GitHub repos from props or fetch from user data
  let repoUrls: string[] = []
  if (githubRepos && githubRepos.length > 0) {
    repoUrls = githubRepos
    console.log("GitHub repos from props:", githubRepos)
  } else {
    // Fallback: fetch user data to get GitHub repos
    const userData = await getUser("jatin")
    repoUrls = userData?.githubRepos || []
    console.log("GitHub repos from user data:", userData?.githubRepos)
  }

  // Extract repository names from GitHub URLs
  const repoNames = repoUrls.map((url) => extractRepoName(url))
  console.log("Repository URLs:", repoUrls)
  console.log("Repository Names:", repoNames)

  // If no projects and no repos, show empty state
  if (projects.length === 0 && repoNames.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Projects Found</h2>
          <p className="text-white/60">Add some projects to get started!</p>
      </div>
    </div>
  )
  }

  // Always use repo names for the list, regardless of projects
  const projectTitles = repoNames

  console.log("Final data being passed to ProjectSwitcherClient:")
  console.log("- projectTitles:", projectTitles)
  console.log("- repoUrls:", repoUrls)
  console.log("- projects:", projects)

  return (
    <ProjectSwitcherClient
      initialProjects={projects}
      projectTitles={projectTitles}
      repoUrls={repoUrls}
    />
  )
}
