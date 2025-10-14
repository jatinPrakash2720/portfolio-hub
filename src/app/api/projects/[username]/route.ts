import { NextRequest, NextResponse } from "next/server"
import { getAllProjectsSelective } from "@/services/projectServices"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    console.log("Projects API route called")
    const { username } = await params
    console.log("Username extracted:", username)

    if (!username) {
      console.log("No username provided")
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      )
    }

    console.log("Fetching projects data from Firebase for:", username)
    const projectsData = await getAllProjectsSelective(username)
    console.log(
      "Projects data received:",
      projectsData ? "Data found" : "No data"
    )

    if (!projectsData) {
      console.log("No projects found for username:", username)
      return NextResponse.json({ error: "Projects not found" }, { status: 404 })
    }

    console.log("Returning projects data successfully")
    return NextResponse.json(projectsData)
  } catch (error) {
    console.error("Error in projects API route:", error)
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error)
    )
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    )
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
