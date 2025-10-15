import { useState, useEffect, useCallback } from "react"

interface EmailValidationState {
  isValid: boolean | null
  isChecking: boolean
  message: string
}

interface EmailValidationResponse {
  success: boolean
  isValid: boolean
  message: string
}

export function useEmailValidation(debounceMs: number = 500) {
  const [email, setEmail] = useState("")
  const [validationState, setValidationState] = useState<EmailValidationState>({
    isValid: null,
    isChecking: false,
    message: "",
  })

  const validateEmail = useCallback(async (emailToValidate: string) => {
    if (!emailToValidate.trim()) {
      setValidationState({
        isValid: null,
        isChecking: false,
        message: "",
      })
      return
    }

    setValidationState((prev) => ({
      ...prev,
      isChecking: true,
      message: "Checking email...",
    }))

    try {
      const response = await fetch("/api/validate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailToValidate }),
      })

      const result: EmailValidationResponse = await response.json()

      if (result.success) {
        setValidationState({
          isValid: result.isValid,
          isChecking: false,
          message: result.message,
        })
      } else {
        setValidationState({
          isValid: false,
          isChecking: false,
          message: result.message || "Validation failed",
        })
      }
    } catch (error) {
      console.error("Error validating email:", error)
      setValidationState({
        isValid: false,
        isChecking: false,
        message: "Network error during validation",
      })
    }
  }, [])

  // Debounced email validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (email.trim()) {
        validateEmail(email)
      } else {
        setValidationState({
          isValid: null,
          isChecking: false,
          message: "",
        })
      }
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [email, debounceMs, validateEmail])

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail)
  }

  const resetValidation = () => {
    setEmail("")
    setValidationState({
      isValid: null,
      isChecking: false,
      message: "",
    })
  }

  return {
    email,
    validationState,
    handleEmailChange,
    resetValidation,
  }
}
