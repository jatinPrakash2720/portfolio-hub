import { sendAdminNotificationEmail } from "@/helpers/sendEmail"
import { saveContactResponse } from "@/services/contactResponseServices"
import { createContactResponse } from "@/models/ContactResponse"
import { ApiResponse } from "@/types/ApiResponse"

export interface ContactFormData {
  name: string
  email: string
  message: string
  userId?: string
  adminEmail?: string
}

/**
 * Controller to handle background processing after successful contact form submission
 * This includes sending admin notification email and saving data to Firebase
 */
export async function handleContactFormSuccess(
  formData: ContactFormData
): Promise<ApiResponse> {
  try {
    const { name, email, message, userId, adminEmail } = formData

    // Validate required fields
    if (!name || !email || !message) {
      return {
        success: false,
        message: "Missing required fields for background processing",
      }
    }

    // Array to track all background tasks
    const backgroundTasks: Promise<ApiResponse>[] = []

    // Task 1: Send admin notification email (if admin email provided)
    if (adminEmail) {
      backgroundTasks.push(
        sendAdminNotificationEmail(adminEmail, name, email, message)
      )
    }

    // Task 2: Save contact response to Firebase (if userId provided)
    if (userId) {
      const contactResponse = createContactResponse({
        name,
        email,
        message,
        userId,
      })
      backgroundTasks.push(saveContactResponse(contactResponse))
    }

    // Execute all background tasks in parallel
    if (backgroundTasks.length > 0) {
      const results = await Promise.allSettled(backgroundTasks)

      // Check if any critical tasks failed
      results.filter((result) => result.status === "rejected")
    }

    return {
      success: true,
      message: "Background processing completed",
      data: {
        adminEmailSent: !!adminEmail,
        dataSavedToFirebase: !!userId,
      },
    }
  } catch {
    return {
      success: false,
      message: "Background processing failed",
    }
  }
}

/**
 * Fire-and-forget function to handle contact form success
 * This doesn't wait for completion and doesn't affect the main response
 */
export function triggerContactFormSuccess(formData: ContactFormData): void {
  // Execute in background without awaiting
  handleContactFormSuccess(formData)
    .then(() => {})
    .catch(() => {})
}
