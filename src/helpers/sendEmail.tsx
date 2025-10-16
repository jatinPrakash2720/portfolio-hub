import { resend } from "@/lib/resend"
import UserConfirmationEmail from "../../emails/UserConfirmationEmail"
import AdminNotificationEmail from "../../emails/AdminNotificationEmail"
import { ApiResponse } from "../types/ApiResponse"
import { createContactResponse } from "../models/ContactResponse"
import { saveContactResponse } from "../services/contactResponseServices"

export async function sendUserConfirmationEmail(
  email: string,
  name: string,
  message: string
): Promise<ApiResponse> {
  try {
    const result = await resend.emails.send({
      from: "Jatin Prakash's Portfolio <noreply@jatinbuilds.com>",
      to: email,
      subject: "Thank you for reaching out!",
      react: <UserConfirmationEmail name={name} message={message} />,
    })

    // Check if email was sent successfully and get the email ID
    if (!result.data?.id) {
      return {
        success: false,
        message: "Failed to send email - no email ID returned",
      }
    }

    // Wait a moment for the email to be processed
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Check email status using resend.emails.get()
    try {
      const emailStatus = await resend.emails.get(result.data.id)

      // Check if email bounced or failed
      if (emailStatus.data?.last_event) {
        const lastEvent = emailStatus.data.last_event

        // Check for bounce, failed, or other error states
        if (["bounced", "failed", "complained"].includes(lastEvent)) {
          return {
            success: false,
            message: `Email ${lastEvent}. Please check your email address.`,
            data: {
              emailId: result.data.id,
              lastEvent: lastEvent,
              emailStatus: emailStatus.data,
            },
          }
        }

        // Email was delivered successfully
        if (["delivered", "sent", "opened", "clicked"].includes(lastEvent)) {
          return {
            success: true,
            message: "Confirmation email sent successfully!",
            data: {
              emailId: result.data.id,
              lastEvent: lastEvent,
              emailStatus: emailStatus.data,
            },
          }
        }

        // Email is still being processed (queued, scheduled, etc.)
        if (["queued", "scheduled", "delivery_delayed"].includes(lastEvent)) {
          return {
            success: true,
            message: "Confirmation email queued for delivery!",
            data: {
              emailId: result.data.id,
              lastEvent: lastEvent,
              emailStatus: emailStatus.data,
            },
          }
        }
      }

      // If we can't determine the status, assume success since send didn't throw
      return {
        success: true,
        message: "Confirmation email sent successfully!",
        data: {
          emailId: result.data.id,
          emailStatus: emailStatus.data,
        },
      }
    } catch (statusError) {
      // If status check fails, assume success since send didn't throw
      return {
        success: true,
        message: "Confirmation email sent successfully!",
        data: { emailId: result.data.id },
      }
    }
  } catch (emailError: any) {
    return {
      success: false,
      message: "Enter valid email",
    }
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

    const result = await resend.emails.send({
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

    // Check if email was sent successfully and get the email ID
    if (!result.data?.id) {
      return {
        success: false,
        message:
          "Failed to send admin notification email - no email ID returned",
      }
    }

    // Wait a moment for the email to be processed
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Check email status using resend.emails.get()
    try {
      const emailStatus = await resend.emails.get(result.data.id)

      // Check if email bounced or failed
      if (emailStatus.data?.last_event) {
        const lastEvent = emailStatus.data.last_event

        // Check for bounce, failed, or other error states
        if (["bounced", "failed", "complained"].includes(lastEvent)) {
          return {
            success: false,
            message: `Admin notification email ${lastEvent}. Please check admin email address.`,
            data: {
              emailId: result.data.id,
              lastEvent: lastEvent,
              emailStatus: emailStatus.data,
            },
          }
        }

        // Email was delivered successfully
        if (["delivered", "sent", "opened", "clicked"].includes(lastEvent)) {
          return {
            success: true,
            message: "Admin notification email sent successfully!",
            data: {
              emailId: result.data.id,
              lastEvent: lastEvent,
              emailStatus: emailStatus.data,
            },
          }
        }

        // Email is still being processed (queued, scheduled, etc.)
        if (["queued", "scheduled", "delivery_delayed"].includes(lastEvent)) {
          return {
            success: true,
            message: "Admin notification email queued for delivery!",
            data: {
              emailId: result.data.id,
              lastEvent: lastEvent,
              emailStatus: emailStatus.data,
            },
          }
        }
      }

      // If we can't determine the status, assume success since send didn't throw
      return {
        success: true,
        message: "Admin notification email sent successfully!",
        data: {
          emailId: result.data.id,
          emailStatus: emailStatus.data,
        },
      }
    } catch (statusError) {
      // If status check fails, assume success since send didn't throw
      return {
        success: true,
        message: "Admin notification email sent successfully!",
        data: { emailId: result.data.id },
      }
    }
  } catch (emailError: any) {
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
      // Continue execution even if saving fails - emails were sent successfully
    }

    return {
      success: true,
      message: "Contact form submitted successfully! Emails sent.",
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to process contact form submission",
    }
  }
}
