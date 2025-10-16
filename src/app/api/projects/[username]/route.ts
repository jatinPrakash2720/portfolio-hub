import { NextRequest, NextResponse } from "next/server"
import { getAllProjectsSelective } from "@/services/projectServices"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      )
    }

    const projectsData = await getAllProjectsSelective(username)

    if (!projectsData) {
      return NextResponse.json({ error: "Projects not found" }, { status: 404 })
    }

    return NextResponse.json(projectsData)
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
