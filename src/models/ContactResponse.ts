import { z } from "zod"

export const ContactResponseSchema = z.object({
  id: z
    .string()
    .optional()
    .describe("Unique identifier for the contact response"),
  name: z
    .string()
    .min(2, { message: "Name must have at least 2 characters" })
    .max(100, { message: "Name must not exceed 100 characters" })
    .describe("Name of the person who submitted the contact form"),
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .describe("Email address of the person who submitted the contact form"),
  message: z
    .string()
    .min(10, { message: "Message must have at least 10 characters" })
    .max(2000, { message: "Message must not exceed 2000 characters" })
    .describe("Message content submitted by the user"),
  dateOfResponse: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .describe("Date when the response was sent (YYYY-MM-DD format)"),
  timeOfResponse: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Time must be in HH:MM:SS format")
    .describe("Time when the response was sent (HH:MM:SS format)"),
  userId: z
    .string()
    .min(1, { message: "User ID is required" })
    .describe("ID of the portfolio owner (e.g., 'jatin', 'himanshu')"),
  createdAt: z
    .date()
    .optional()
    .describe("Timestamp when the record was created"),
  updatedAt: z
    .date()
    .optional()
    .describe("Timestamp when the record was last updated"),
})

export type ContactResponse = z.infer<typeof ContactResponseSchema>

// Helper function to create a contact response with current date/time
export const createContactResponse = (data: {
  name: string
  email: string
  message: string
  userId: string
}): Omit<ContactResponse, "id" | "createdAt" | "updatedAt"> => {
  const now = new Date()
  const dateOfResponse = now.toISOString().split("T")[0] // YYYY-MM-DD
  const timeOfResponse = now.toTimeString().split(" ")[0] // HH:MM:SS

  return {
    name: data.name,
    email: data.email,
    message: data.message,
    dateOfResponse,
    timeOfResponse,
    userId: data.userId,
  }
}

// Validation function for contact form data
export const validateContactForm = (data: unknown) => {
  return ContactResponseSchema.omit({
    id: true,
    dateOfResponse: true,
    timeOfResponse: true,
    createdAt: true,
    updatedAt: true,
  }).parse(data)
}
