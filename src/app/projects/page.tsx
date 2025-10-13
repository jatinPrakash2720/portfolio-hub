import ProjectPage from "@/components/pages/ProjectPage"

type PageProps = {
  searchParams: {
    githubRepos?: string | string[]
  }
}

export default function Page({ searchParams }: PageProps) {
  // Handle comma-separated string and convert to array
  let githubRepos: string[] | undefined = undefined

  if (searchParams.githubRepos) {
    if (Array.isArray(searchParams.githubRepos)) {
      githubRepos = searchParams.githubRepos
    } else {
      // Split comma-separated string into array
      githubRepos = searchParams.githubRepos.split(",").filter(Boolean)
    }
  }

  return <ProjectPage githubRepos={githubRepos} />
}
