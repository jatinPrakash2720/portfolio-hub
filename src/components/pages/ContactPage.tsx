"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { ApiResponse } from "@/types/ApiResponse"
import { useUserDataContext } from "@/contexts/UserDataContext"
import { useRouter } from "next/navigation"
import { useEmailValidation } from "@/hooks/useEmailValidation"

// Lazy load UI components
const PixelBlast = lazy(() => import("../ui/PixelBlast"))

export default function ContactPage() {
  const { userData, setContactLoading, setIntroLoading, setProjectsLoading } =
    useUserDataContext()
  const router = useRouter()
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [isNavigatingToIntro, setIsNavigatingToIntro] = useState(false)
  const [isNavigatingToProjects, setIsNavigatingToProjects] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  // Message modal state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [tempMessage, setTempMessage] = useState("")

  // Email validation with debounce
  const { email, validationState, handleEmailChange, resetValidation } =
    useEmailValidation(500)

  // Check if form is valid for submission
  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.message.trim().length > 0 &&
    validationState.isValid === true &&
    !validationState.isChecking

  // Clear contact loading state when component mounts
  useEffect(() => {
    setContactLoading(false)
  }, [setContactLoading])

  // Navigation handlers
  const handleIntroNavigation = async () => {
    setIsNavigatingToIntro(true)
    setIntroLoading(true)

    // Small delay to show the loading state
    await new Promise((resolve) => setTimeout(resolve, 500))

    router.push("/intro")
  }

  const handleProjectsNavigation = async () => {
    setIsNavigatingToProjects(true)
    setProjectsLoading(true)

    // Small delay to show the loading state
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Construct URL with query parameters
    const githubReposParam = (userData?.githubRepos || []).join(",")
    const url = githubReposParam
      ? `/projects?githubRepos=${encodeURIComponent(githubReposParam)}`
      : "/projects"

    router.push(url)
  }

  const handleCopy = async (text: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(itemName)
      setTimeout(() => setCopiedItem(null), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Handle email validation with debounce
    if (name === "email") {
      handleEmailChange(value)
    }
  }

  // Message modal handlers
  const openMessageModal = () => {
    setTempMessage(formData.message)
    setIsMessageModalOpen(true)
  }

  const closeMessageModal = () => {
    setFormData((prev) => ({
      ...prev,
      message: tempMessage,
    }))
    setIsMessageModalOpen(false)
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTempMessage(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
          userId: userData?.username || "jatin", // Dynamic based on portfolio owner
          adminEmail: userData?.email || "jatin.prakash.2720@gmail.com", // Dynamic admin email
        }),
      })

      const result: ApiResponse = await response.json()

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message:
            "Message sent successfully! Check your email for confirmation.",
        })
        // Reset form
        setFormData({ name: "", email: "", message: "" })
        resetValidation()

        // Reset success state after 3 seconds
        setTimeout(() => {
          setSubmitStatus({ type: null, message: "" })
        }, 3000)
      } else {
        setSubmitStatus({
          type: "error",
          message:
            result.message || "Failed to send message. Please try again.",
        })

        // Reset error state after 3 seconds
        setTimeout(() => {
          setSubmitStatus({ type: null, message: "" })
        }, 3000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      })

      // Reset error state after 3 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" })
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <>
      <style jsx>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5) inset !important;
          -webkit-text-fill-color: white !important;
          background-color: rgba(0, 0, 0, 0.5) !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        input:not(:-webkit-autofill),
        textarea:not(:-webkit-autofill) {
          background-color: rgba(0, 0, 0, 0.5) !important;
        }
      `}</style>
      <div className="h-screen flex relative transition-colors duration-300 bg-black text-white">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Suspense fallback={null}>
            <PixelBlast
              variant="circle"
              pixelSize={4}
              color="#A855F7"
              patternScale={2}
              patternDensity={0.8}
              pixelSizeJitter={0.3}
              enableRipples={false}
              liquid={false}
              speed={0.3}
              edgeFade={0.15}
              transparent
            />
          </Suspense>
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-300 bg-purple-900/10" />

        <main
          className="relative z-10 w-screen overflow-hidden p-1"
          style={{ height: "100dvh" }}
        >
          {/* Mobile: 6x6 Grid, Tablet: 8x5, Desktop: 8x6 Grid */}
          <div
            className="relative grid grid-cols-6 grid-rows-5 sm:grid-cols-6 sm:grid-rows-5 md:grid-cols-8 md:grid-rows-5 lg:grid-rows-6 p-2"
            style={{
              gap: "10px",
              padding: "6px",
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Contact Form - Mobile: 6x5, Tablet: 6x5, Desktop: 6x6 */}
            <div className="col-span-6 row-span-3 col-start-1 row-start-2 sm:col-span-6 sm:row-span-3 sm:col-start-1 sm:row-start-2 md:col-span-6 md:row-span-5 lg:row-span-6 md:col-start-1 md:row-start-1 lg:row-start-1 rounded-2xl md:rounded-3xl border-2 p-3 md:p-6 lg:p-8 flex flex-col z-10 group hover:border-transparent transition-all duration-300 hover:bg-opacity-80 relative backdrop-blur-sm bg-[#0F0F0F]/80 border-purple-500/20">
              {/* Header - Hidden on small screens */}
              <div className="hidden md:block">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 text-white">
                  Let&apos;s Collaborate
                </h2>
                <p className="text-[11px] md:text-sm lg:text-base text-white/60 mb-4 md:mb-6">
                  Have an idea? Want to work together? Drop me a message!
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col gap-3 md:gap-4"
              >
                {/* Status Message */}
                {submitStatus.type && (
                  <div
                    className={`p-3 rounded-xl text-sm font-medium ${
                      submitStatus.type === "success"
                        ? "bg-green-500/20 border border-green-400/40 text-green-400"
                        : "bg-red-500/20 border border-red-400/40 text-red-400"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                {/* Mobile Grid Layout - 6 cols x 3 rows */}
                <div className="md:hidden grid grid-cols-6 grid-rows-3 gap-2 h-full">
                  {/* Row 1: Send Icon - 6th column */}
                  <div className="col-start-6 row-start-1 flex items-center justify-center">
                    <button
                      type="submit"
                      disabled={isSubmitting || !isFormValid}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isSubmitting || !isFormValid
                          ? "bg-gray-500/20 border-gray-400/40 text-white cursor-not-allowed"
                          : "bg-purple-500/20 border-purple-400/40 text-white hover:bg-purple-500/30 hover:border-purple-400/60"
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : submitStatus.type === "success" ? (
                        <svg
                          className="w-5 h-5 text-green-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : submitStatus.type === "error" ? (
                        <svg
                          className="w-5 h-5 text-red-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Row 2: Name (cols 1-2) and Email (cols 3-4) */}
                  {/* Name Input - cols 1-2 */}
                  <div className="col-span-5 row-start-1 col-start-1 flex items-center justify-center">
                    <div className="relative w-full">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                        minLength={2}
                        maxLength={100}
                        className={`w-full h-full px-3 py-4 rounded-lg bg-black/50 border text-white text-sm focus:outline-none transition-colors autofill:bg-black/50 autofill:text-white [&:-webkit-autofill]:bg-black/50 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.5)] ${
                          formData.name.trim().length > 0
                            ? "border-green-500/50 focus:border-green-500/70"
                            : "border-purple-500/20 focus:border-purple-500/50"
                        }`}
                      />
                      {/* Name validation indicator */}
                      {formData.name.trim().length > 0 && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <svg
                            className="w-3 h-3 text-green-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email Input - cols 3-4 */}
                  <div className="col-span-6 row-start-2 col-start-1 flex items-center justify-center">
                    <div className="relative w-full">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                        className={`w-full h-full px-3 py-4 pr-8 rounded-lg bg-black/50 border text-white text-sm focus:outline-none transition-colors autofill:bg-black/50 autofill:text-white [&:-webkit-autofill]:bg-black/50 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.5)] ${
                          validationState.isValid === true
                            ? "border-green-500/50 focus:border-green-500/70"
                            : validationState.isValid === false
                            ? "border-red-500/50 focus:border-red-500/70"
                            : "border-purple-500/20 focus:border-purple-500/50"
                        }`}
                      />
                      {/* Loading spinner and validation status indicator */}
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        {validationState.isChecking ? (
                          <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                        ) : validationState.isValid === true ? (
                          <svg
                            className="w-3 h-3 text-green-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : validationState.isValid === false ? (
                          <svg
                            className="w-3 h-3 text-red-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        ) : null}
                      </div>
                    </div>
                    {/* Validation message */}
                    {validationState.message && (
                      <div
                        className={`mt-1 text-xs ${
                          validationState.isValid === true
                            ? "text-green-400"
                            : validationState.isValid === false
                            ? "text-red-400"
                            : "text-purple-400"
                        }`}
                      >
                        {validationState.message}
                      </div>
                    )}
                  </div>

                  {/* Row 3: Write Message Button - full width */}
                  <div className="col-span-6 row-start-3 flex items-center">
                    <button
                      type="button"
                      onClick={openMessageModal}
                      className={`w-full h-full py-4 px-3 rounded-lg border-2 text-sm font-medium transition-all duration-300 flex items-center justify-center ${
                        formData.message.trim().length > 0
                          ? "bg-green-500/20 border-green-400/40 text-green-400"
                          : "bg-purple-500/20 border-purple-400/40 text-white hover:bg-purple-500/30"
                      }`}
                    >
                      {formData.message.trim().length > 0
                        ? "Edit Message"
                        : "Write Message"}
                    </button>
                  </div>
                </div>

                {/* Desktop Layout - Hidden on mobile */}
                <div className="hidden md:flex flex-1 flex-col gap-4">
                  {/* Name and Email Inputs */}
                  <div className="grid grid-cols-1 gap-4">
                    {/* Name Input */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-[11px] md:text-sm font-medium mb-1 md:mb-2 text-white"
                      >
                        Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          required
                          minLength={2}
                          maxLength={100}
                          className={`w-full px-3 md:px-4 py-2 md:py-3 pr-10 rounded-xl md:rounded-2xl bg-black/50 border text-white text-[11px] md:text-sm focus:outline-none transition-colors autofill:bg-black/50 autofill:text-white [&:-webkit-autofill]:bg-black/50 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.5)] ${
                            formData.name.trim().length > 0
                              ? "border-green-500/50 focus:border-green-500/70"
                              : "border-purple-500/20 focus:border-purple-500/50"
                          }`}
                        />
                        {/* Name validation indicator */}
                        {formData.name.trim().length > 0 && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg
                              className="w-4 h-4 text-green-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[11px] md:text-sm font-medium mb-1 md:mb-2 text-white"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                          className={`w-full px-3 md:px-4 py-2 md:py-3 pr-12 md:pr-10 rounded-xl md:rounded-2xl bg-black/50 border text-white text-[11px] md:text-sm focus:outline-none transition-colors autofill:bg-black/50 autofill:text-white [&:-webkit-autofill]:bg-black/50 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.5)] ${
                            validationState.isValid === true
                              ? "border-green-500/50 focus:border-green-500/70"
                              : validationState.isValid === false
                              ? "border-red-500/50 focus:border-red-500/70"
                              : "border-purple-500/20 focus:border-purple-500/50"
                          }`}
                        />
                        {/* Loading spinner and validation status indicator */}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {validationState.isChecking ? (
                            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                          ) : validationState.isValid === true ? (
                            <svg
                              className="w-4 h-4 text-green-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          ) : validationState.isValid === false ? (
                            <svg
                              className="w-4 h-4 text-red-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          ) : null}
                        </div>
                      </div>
                      {/* Validation message */}
                      {validationState.message && (
                        <div
                          className={`mt-1 text-[10px] md:text-xs ${
                            validationState.isValid === true
                              ? "text-green-400"
                              : validationState.isValid === false
                              ? "text-red-400"
                              : "text-purple-400"
                          }`}
                        >
                          {validationState.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Input - Desktop */}
                  <div className="flex-1 flex flex-col">
                    <label
                      htmlFor="message-desktop"
                      className="block text-sm font-medium mb-2 text-white"
                    >
                      Message
                    </label>
                    <div className="relative flex-1">
                      <textarea
                        id="message-desktop"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Share your ideas..."
                        required
                        minLength={10}
                        maxLength={2000}
                        rows={8}
                        className={`w-full h-48 px-4 py-3 pr-10 rounded-2xl bg-black/50 border text-white text-sm focus:outline-none transition-colors resize-none autofill:bg-black/50 autofill:text-white [&:-webkit-autofill]:bg-black/50 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.5)] ${
                          formData.message.trim().length > 0
                            ? "border-green-500/50 focus:border-green-500/70"
                            : "border-purple-500/20 focus:border-purple-500/50"
                        }`}
                      />
                      {/* Message validation indicator */}
                      {formData.message.trim().length > 0 && (
                        <div className="absolute right-3 top-3">
                          <svg
                            className="w-4 h-4 text-green-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button - Desktop */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className={`w-full py-3 rounded-2xl border-2 text-base font-semibold transition-all duration-300 ${
                      isSubmitting || !isFormValid
                        ? "bg-gray-500/20 border-gray-400/40 text-white cursor-not-allowed"
                        : "bg-purple-500/20 border-purple-400/40 text-white hover:bg-purple-500/30 hover:border-purple-400/60"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Info Strip - Mobile: 6x1 (top), Desktop: 2x4 (right top) */}
            <div className="col-span-6 row-span-1 col-start-1 row-start-1 sm:col-span-6 sm:row-span-1 sm:col-start-1 sm:row-start-1 md:col-span-2 md:row-span-3 md:col-start-7 md:row-start-1 lg:row-span-4 lg:col-span-2 lg:row-start-1 rounded-2xl md:rounded-3xl border-2 p-2 md:p-3 flex md:flex-col lg:grid lg:grid-cols-2 lg:grid-rows-3 items-center md:justify-center gap-2 md:gap-3 z-10 group hover:border-transparent transition-all duration-300 backdrop-blur-sm bg-[#0F0F0F]/80 border-purple-500/20">
              {/* GitHub */}
              <button
                onClick={() =>
                  handleCopy(
                    userData?.socialLinks?.githubProfile || "jatinbuilds",
                    "github"
                  )
                }
                className={`w-full h-full flex items-center justify-between gap-2 px md:px-4 lg:col-span-1 lg:row-span-1  rounded-xl transition-all duration-300 group/icon relative overflow-hidden ${
                  copiedItem === "github"
                    ? "bg-green-500/20 border border-green-400/40"
                    : "bg-purple-500/10 hover:bg-purple-500/20"
                }`}
              >
                <div className="flex flex-col items-center justify-center flex-1 w-full">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 mb-0.5 sm:mb-1 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  {copiedItem === "github" ? (
                    <span className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-xs text-green-400 font-medium text-center animate-pulse">
                      Copied!
                    </span>
                  ) : (
                    <span className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-xs text-white/60 text-center break-words">
                      {userData?.socialLinks?.githubProfile || "jatinbuilds"}
                    </span>
                  )}
                </div>
                {/* Copy icon positioned in top right corner */}
                <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1">
                  {copiedItem === "github" ? (
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-green-400 animate-pulse"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-white/60 group-hover:text-white/80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </div>
                {copiedItem === "github" && (
                  <div className="absolute inset-0 bg-green-500/10 animate-ping" />
                )}
              </button>

              {/* LinkedIn */}
              <button
                onClick={() =>
                  handleCopy(
                    userData?.socialLinks?.linkedInProfile ||
                      "linkedin.com/in/jatinbuilds",
                    "linkedin"
                  )
                }
                className={`w-full h-full flex items-center justify-between gap-2 px-3 md:px-4  lg:col-span-1 lg:row-span-1  rounded-xl transition-all duration-300 group/icon relative overflow-hidden ${
                  copiedItem === "linkedin"
                    ? "bg-green-500/20 border border-green-400/40"
                    : "bg-purple-500/10 hover:bg-purple-500/20"
                }`}
              >
                <div className="flex flex-col items-center justify-center flex-1 w-full">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 mb-0.5 sm:mb-1 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  {copiedItem === "linkedin" ? (
                    <span className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-xs text-green-400 font-medium text-center animate-pulse">
                      Copied!
                    </span>
                  ) : (
                    <span className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-xs text-white/60 text-center break-words">
                      {userData?.socialLinks?.linkedInProfile
                        ? userData.socialLinks.linkedInProfile.includes("/in/")
                          ? userData.socialLinks.linkedInProfile.split(
                              "/in/"
                            )[1]
                          : userData.socialLinks.linkedInProfile
                        : "/in/jatinbuilds"}
                    </span>
                  )}
                </div>
                {/* Copy icon positioned in top right corner */}
                <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1">
                  {copiedItem === "linkedin" ? (
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-green-400 animate-pulse"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-white/60 group-hover:text-white/80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </div>
                {copiedItem === "linkedin" && (
                  <div className="absolute inset-0 bg-green-500/10 animate-ping" />
                )}
              </button>

              {/* Twitter */}
              <button
                onClick={() =>
                  handleCopy(
                    userData?.socialLinks?.twitterProfile || "@jatinbuilds",
                    "twitter"
                  )
                }
                className={`w-full h-full flex items-center justify-between gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 lg:col-span-1 lg:row-span-1 rounded-xl transition-all duration-300 group/icon relative overflow-hidden ${
                  copiedItem === "twitter"
                    ? "bg-green-500/20 border border-green-400/40"
                    : "bg-purple-500/10 hover:bg-purple-500/20"
                }`}
              >
                <div className="flex flex-col items-center justify-center flex-1 w-full">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 mb-0.5 sm:mb-1 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  {copiedItem === "twitter" ? (
                    <span className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-xs text-green-400 font-medium text-center animate-pulse">
                      Copied!
                    </span>
                  ) : (
                    <span className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-xs text-white/60 text-center break-words">
                      {userData?.socialLinks?.twitterProfile || "@jatinbuilds"}
                    </span>
                  )}
                </div>
                {/* Copy icon positioned in top right corner */}
                <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1">
                  {copiedItem === "twitter" ? (
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-green-400 animate-pulse"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-white/60 group-hover:text-white/80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </div>
                {copiedItem === "twitter" && (
                  <div className="absolute inset-0 bg-green-500/10 animate-ping" />
                )}
              </button>

              {/* Email */}
              <button
                onClick={() =>
                  handleCopy(
                    userData?.email || "jatin.prakash.2720@gmail.com",
                    "email"
                  )
                }
                className={`w-full h-full flex items-center justify-between gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 lg:col-span-2 lg:row-span-1 rounded-xl transition-all duration-300 group/icon relative overflow-hidden ${
                  copiedItem === "email"
                    ? "bg-green-500/20 border border-green-400/40"
                    : "bg-purple-500/10 hover:bg-purple-500/20"
                }`}
              >
                <div className="flex flex-col items-center justify-center flex-1 w-full">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 mb-0.5 sm:mb-1 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {copiedItem === "email" ? (
                    <span className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-xs text-green-400 font-medium text-center animate-pulse">
                      Copied!
                    </span>
                  ) : (
                    <div className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-xs text-white/60 text-center leading-tight">
                      {(() => {
                        const email =
                          userData?.email || "jatin.prakash.2720@gmail.com"
                        const atIndex = email.indexOf("@")
                        if (atIndex > 0) {
                          return (
                            <>
                              <div>{email.substring(0, atIndex)}</div>
                              <div>{email.substring(atIndex)}</div>
                            </>
                          )
                        }
                        return <div>{email}</div>
                      })()}
                    </div>
                  )}
                </div>
                {/* Copy icon positioned in top right corner */}
                <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1">
                  {copiedItem === "email" ? (
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-green-400 animate-pulse"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-white/60 group-hover:text-white/80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </div>
                {copiedItem === "email" && (
                  <div className="absolute inset-0 bg-green-500/10 animate-ping" />
                )}
              </button>

              {/* Phone */}
              <button
                onClick={() =>
                  handleCopy(userData?.phone || "+91 7668166475", "phone")
                }
                className={`w-full h-full flex items-center justify-between gap-2 px-3 md:px-4  lg:col-span-1 lg:row-span-1 lg:col-start-2 lg:row-start-2  rounded-xl transition-all duration-300 group/icon relative overflow-hidden ${
                  copiedItem === "phone"
                    ? "bg-green-500/20 border border-green-400/40"
                    : "bg-purple-500/10 hover:bg-purple-500/20"
                }`}
              >
                <div className="flex flex-col items-center justify-center flex-1 w-full">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 mb-0.5 sm:mb-1 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {copiedItem === "phone" ? (
                    <span className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-xs text-green-400 font-medium text-center animate-pulse">
                      Copied!
                    </span>
                  ) : (
                    <span className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-xs text-white/60 text-center break-words">
                      {userData?.phone || "+91 7668166475"}
                    </span>
                  )}
                </div>
                {/* Copy icon positioned in top right corner */}
                <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1">
                  {copiedItem === "phone" ? (
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-green-400 animate-pulse"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg
                      className="w-2 h-2 sm:w-3 sm:h-3 text-white/60 group-hover:text-white/80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </div>
                {copiedItem === "phone" && (
                  <div className="absolute inset-0 bg-green-500/10 animate-ping" />
                )}
              </button>
            </div>

            {/* Profile Button - Desktop: 2x1 */}
            <div className="col-span-2 row-span-1 col-start-1 row-start-5 sm:col-span-3 sm:row-span-1 sm:col-start-1 sm:row-start-5 md:col-span-2 md:row-span-1  md:col-start-7 md:row-start-4 lg:row-span-2 lg:col-span-1 lg:row-start-5 z-10">
              <button
                onClick={handleIntroNavigation}
                disabled={isNavigatingToIntro}
                className="w-full h-full rounded-2xl lg:rounded-3xl border-2 p-2 lg:p-3 flex flex-col items-center justify-center transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-purple-500/15 border-purple-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigatingToIntro ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mb-1"></div>
                    <div className="text-xs lg:text-sm font-light text-white/80">
                      Loading...
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-sm lg:text-base group-hover:text-purple-400 transition-colors duration-300">
                      Profile
                    </div>
                    <div className="text-xs lg:text-sm font-light text-white/80">
                      About Me
                    </div>
                  </>
                )}
              </button>
            </div>

            {/* Projects Button - Desktop: 2x1 */}
            <div className=" col-span-4 row-span-1 col-start-3 row-start-5 sm:col-span-3 sm:row-span-1 sm:col-start-4 sm:row-start-5 md:block md:col-span-2 md:row-span-1 md:col-start-7 md:row-start-5 lg:row-span-2 lg:col-span-1 lg:row-start-5 z-10">
              <button
                onClick={handleProjectsNavigation}
                disabled={isNavigatingToProjects}
                className="w-full h-full rounded-2xl lg:rounded-3xl border-2 p-2 lg:p-3 flex flex-col items-center justify-center transition-all duration-300 group relative hover:border-transparent backdrop-blur-sm bg-purple-500/15 border-purple-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigatingToProjects ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mb-1"></div>
                    <div className="text-xs lg:text-sm font-light text-white/80">
                      Loading...
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-sm lg:text-base group-hover:text-purple-400 transition-colors duration-300">
                      Projects
                    </div>
                    <div className="text-xs lg:text-sm font-light text-white/80">
                      Portfolio
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>

        {/* Message Modal */}
        {isMessageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blurred Background */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeMessageModal}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-[#0F0F0F]/95 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Write Message
                </h3>
                <button
                  onClick={closeMessageModal}
                  className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-white hover:bg-purple-500/30 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <textarea
                value={tempMessage}
                onChange={handleMessageChange}
                placeholder="Share your ideas..."
                className="w-full h-64 px-4 py-3 rounded-xl bg-black/50 border border-purple-500/20 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors resize-none autofill:bg-black/50 autofill:text-white [&:-webkit-autofill]:bg-black/50 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.5)]"
              />

              <div className="flex justify-end mt-4">
                <button
                  onClick={closeMessageModal}
                  className="px-6 py-2 bg-purple-500/20 border border-purple-400/40 text-white rounded-xl hover:bg-purple-500/30 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
