import { useState } from "react"
import { ApiResponse } from "@/types/ApiResponse"

interface ContactFormData {
  name: string
  email: string
  message: string
}

interface ContactFormState {
  formData: ContactFormData
  isSubmitting: boolean
  submitStatus: {
    type: "success" | "error" | null
    message: string
  }
}

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", message: "" })
    setSubmitStatus({ type: null, message: "" })
  }

  const submitForm = async (
    userId: string,
    adminEmail: string = "jatin.prakash.2720@gmail.com"
  ): Promise<boolean> => {
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId,
          adminEmail,
        }),
      })

      const result: ApiResponse = await response.json()

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message:
            "Message sent successfully! Check your email for confirmation.",
        })
        resetForm()
        return true
      } else {
        setSubmitStatus({
          type: "error",
          message:
            result.message || "Failed to send message. Please try again.",
        })
        return false
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    isSubmitting,
    submitStatus,
    handleInputChange,
    resetForm,
    submitForm,
  }
}
