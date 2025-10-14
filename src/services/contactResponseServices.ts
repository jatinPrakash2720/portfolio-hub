import {
  ContactResponse,
  ContactResponseSchema,
  validateContactForm,
} from "../models/ContactResponse"
import { ApiResponse } from "../types/ApiResponse"

// In-memory storage for demo purposes
// In production, replace this with actual database operations
const contactResponses: ContactResponse[] = []

export async function saveContactResponse(
  contactData: Omit<ContactResponse, "id" | "createdAt" | "updatedAt">
): Promise<ApiResponse> {
  try {
    // Validate the contact data
    const validatedData = ContactResponseSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    }).parse(contactData)

    // Create new contact response with ID and timestamps
    const newContactResponse: ContactResponse = {
      ...validatedData,
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save to storage (replace with database operation)
    contactResponses.push(newContactResponse)

    return {
      success: true,
      message: "Contact response saved successfully",
    }
  } catch (error) {
    console.error("Error saving contact response:", error)
    return {
      success: false,
      message: "Failed to save contact response",
    }
  }
}

export async function getContactResponsesByUserId(userId: string): Promise<{
  success: boolean
  data?: ContactResponse[]
  message: string
}> {
  try {
    const userResponses = contactResponses.filter(
      (response) => response.userId === userId
    )

    return {
      success: true,
      data: userResponses,
      message: `Found ${userResponses.length} contact responses for user ${userId}`,
    }
  } catch (error) {
    console.error("Error fetching contact responses:", error)
    return {
      success: false,
      message: "Failed to fetch contact responses",
    }
  }
}

export async function getAllContactResponses(): Promise<{
  success: boolean
  data?: ContactResponse[]
  message: string
}> {
  try {
    return {
      success: true,
      data: contactResponses,
      message: `Found ${contactResponses.length} total contact responses`,
    }
  } catch (error) {
    console.error("Error fetching all contact responses:", error)
    return {
      success: false,
      message: "Failed to fetch contact responses",
    }
  }
}

export async function getContactResponseById(id: string): Promise<{
  success: boolean
  data?: ContactResponse
  message: string
}> {
  try {
    const contactResponse = contactResponses.find(
      (response) => response.id === id
    )

    if (!contactResponse) {
      return {
        success: false,
        message: "Contact response not found",
      }
    }

    return {
      success: true,
      data: contactResponse,
      message: "Contact response found",
    }
  } catch (error) {
    console.error("Error fetching contact response by ID:", error)
    return {
      success: false,
      message: "Failed to fetch contact response",
    }
  }
}

export async function deleteContactResponse(id: string): Promise<ApiResponse> {
  try {
    const index = contactResponses.findIndex((response) => response.id === id)

    if (index === -1) {
      return {
        success: false,
        message: "Contact response not found",
      }
    }

    contactResponses.splice(index, 1)

    return {
      success: true,
      message: "Contact response deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting contact response:", error)
    return {
      success: false,
      message: "Failed to delete contact response",
    }
  }
}

// Helper function to validate contact form data before processing
export function validateContactFormData(data: unknown) {
  try {
    return validateContactForm(data)
  } catch (error) {
    throw new Error(`Invalid contact form data: ${error}`)
  }
}
