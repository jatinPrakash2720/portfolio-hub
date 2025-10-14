import ProjectPage from "@/components/pages/ProjectPage"

type PageProps = {
  searchParams: Promise<{
    githubRepos?: string | string[]
  }>
}

export default async function Page({ searchParams }: PageProps) {
  // Handle comma-separated string and convert to array
  let githubRepos: string[] | undefined = undefined

  const resolvedSearchParams = await searchParams

  if (resolvedSearchParams.githubRepos) {
    if (Array.isArray(resolvedSearchParams.githubRepos)) {
      githubRepos = resolvedSearchParams.githubRepos
    } else {
      // Split comma-separated string into array
      githubRepos = resolvedSearchParams.githubRepos.split(",").filter(Boolean)
    }
  }

  return <ProjectPage githubRepos={githubRepos} />
}
