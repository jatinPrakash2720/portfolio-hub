import { NextRequest, NextResponse } from "next/server"
import { sendUserConfirmationEmail } from "@/helpers/sendEmail"
import { triggerContactFormSuccess } from "@/controllers/contactController"
import { ApiResponse } from "@/types/ApiResponse"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: name, email, message",
        } as ApiResponse,
        { status: 400 }
      )
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        } as ApiResponse,
        { status: 400 }
      )
    }

    // Send confirmation email to user
    const userEmailResult = await sendUserConfirmationEmail(
      body.email,
      body.name,
      body.message
    )

    if (!userEmailResult.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to send confirmation email. Please check your email address and try again.",
        } as ApiResponse,
        { status: 400 }
      )
    }

    // Trigger background processing (admin email + Firebase save)
    // This runs asynchronously and doesn't affect the response time
    triggerContactFormSuccess({
      name: body.name,
      email: body.email,
      message: body.message,
      userId: body.userId,
      adminEmail: body.adminEmail,
    })

    return NextResponse.json(
      {
        success: true,
        message:
          "Message sent successfully! Check your email for confirmation.",
      } as ApiResponse,
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      } as ApiResponse,
      { status: 500 }
    )
  }
}
