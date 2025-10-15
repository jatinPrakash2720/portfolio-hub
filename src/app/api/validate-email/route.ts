import { NextRequest, NextResponse } from "next/server"
import { verifyEmailDeliverability } from "@/lib/zeroBounceEmailCheck"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      )
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: true,
          isValid: false,
          message: "Invalid email format",
        },
        { status: 200 }
      )
    }

    // Check email deliverability using ZeroBounce
    const isValid = await verifyEmailDeliverability(email)

    return NextResponse.json(
      {
        success: true,
        isValid,
        message: isValid ? "Email is valid" : "Email is not deliverable",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in email validation API route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Method not allowed. Use POST to validate email.",
    },
    { status: 405 }
  )
}
