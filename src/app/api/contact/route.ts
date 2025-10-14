import { NextRequest, NextResponse } from "next/server"
import { handleContactFormSubmission } from "@/helpers/sendEmail"
import { validateContactFormData } from "@/services/contactResponseServices"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, userId, adminEmail } = body

    // Validate required fields
    if (!name || !email || !message || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: name, email, message, userId",
        },
        { status: 400 }
      )
    }

    // Validate contact form data using Zod schema
    try {
      validateContactFormData({ name, email, message, userId })
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: `Validation error: ${error}`,
        },
        { status: 400 }
      )
    }

    // Set default admin email if not provided
    const adminEmailToUse =
      adminEmail || process.env.ADMIN_EMAIL || "jatin.prakash.2720@gmail.com"

    // Handle the contact form submission
    const result = await handleContactFormSubmission(
      name,
      email,
      message,
      userId,
      adminEmailToUse
    )

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error) {
    console.error("Error in contact API route:", error)
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
      message: "Method not allowed. Use POST to submit contact form.",
    },
    { status: 405 }
  )
}
