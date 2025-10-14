import { resend } from "@/lib/resend"
import UserConfirmationEmail from "../emails/UserConfirmationEmail"
import AdminNotificationEmail from "../emails/AdminNotificationEmail"
import { ApiResponse } from "../types/ApiResponse"
import { createContactResponse } from "../models/ContactResponse"
import { saveContactResponse } from "../services/contactResponseServices"

export async function sendUserConfirmationEmail(
  email: string,
  name: string,
  message: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Jatin Prakash's Portfolio <noreply@jatinbuilds.com>",
      to: email,
      subject: "Thank you for reaching out!",
      react: <UserConfirmationEmail name={name} message={message} />,
    })

    return {
      success: true,
      message: "Confirmation email sent successfully!",
    }
  } catch (emailError) {
    console.error("Error sending user confirmation email", emailError)
    return { success: false, message: "Failed to send confirmation email" }
  }
}

export async function sendAdminNotificationEmail(
  adminEmail: string,
  name: string,
  email: string,
  message: string
): Promise<ApiResponse> {
  try {
    const timestamp = new Date().toLocaleString()

    await resend.emails.send({
      from: "Jatin Prakash's Portfolio <noreply@jatinbuilds.com>",
      to: adminEmail,
      subject: `New contact form submission from ${name}`,
      react: (
        <AdminNotificationEmail
          name={name}
          email={email}
          message={message}
          timestamp={timestamp}
        />
      ),
    })

    return {
      success: true,
      message: "Admin notification email sent successfully!",
    }
  } catch (emailError) {
    console.error("Error sending admin notification email", emailError)
    return {
      success: false,
      message: "Failed to send admin notification email",
    }
  }
}

export async function handleContactFormSubmission(
  name: string,
  email: string,
  message: string,
  userId: string,
  adminEmail: string
): Promise<ApiResponse> {
  try {
    // Create contact response data
    const contactResponse = createContactResponse({
      name,
      email,
      message,
      userId,
    })

    // Send confirmation email to user
    const userEmailResult = await sendUserConfirmationEmail(
      email,
      name,
      message
    )
    if (!userEmailResult.success) {
      return userEmailResult
    }

    // Send notification email to admin
    const adminEmailResult = await sendAdminNotificationEmail(
      adminEmail,
      name,
      email,
      message
    )
    if (!adminEmailResult.success) {
      return adminEmailResult
    }

    // Save contact response to database
    const saveResult = await saveContactResponse(contactResponse)
    if (!saveResult.success) {
      console.error("Failed to save contact response:", saveResult.message)
      // Continue execution even if saving fails - emails were sent successfully
    }

    return {
      success: true,
      message: "Contact form submitted successfully! Emails sent.",
    }
  } catch (error) {
    console.error("Error handling contact form submission", error)
    return {
      success: false,
      message: "Failed to process contact form submission",
    }
  }
}
