// This directive tells Next.js that this component should run on the client side
// Client components can use browser APIs, event handlers, and state
"use client"

// Import React hooks for managing component state and side effects
// useState: manages local component state (form data, UI states, etc.)
// useEffect: handles side effects like API calls, subscriptions, cleanup
// lazy: enables code splitting by loading components only when needed
// Suspense: provides fallback UI while lazy components are loading
import { useState, useEffect, lazy, Suspense } from "react"

// Import the ApiResponse type definition for type safety
// This ensures the API response structure is consistent
import { ApiResponse } from "@/types/ApiResponse"

// Import the custom context hook to access global user data
// This provides user information across the entire application
import { useUserDataContext } from "@/contexts/UserDataContext"

// Import Next.js router for programmatic navigation
// Allows us to navigate to different pages without full page reload
import { useRouter } from "next/navigation"

// Lazy load the PixelBlast component to improve initial page load performance
// The component will only be loaded when it's actually rendered
// This reduces the initial bundle size and improves loading speed
const PixelBlast = lazy(() => import("../ui/PixelBlast"))

// Main ContactPage component - this is the default export
// This component handles the contact form and social media links
export default function ContactPage() {
  // Destructure values from the UserDataContext
  // userData: contains user information like name, email, social links
  // setContactLoading: function to update loading state for contact page
  // setIntroLoading: function to update loading state for intro page
  // setProjectsLoading: function to update loading state for projects page
  const { userData, setContactLoading, setIntroLoading, setProjectsLoading } =
    useUserDataContext()

  // Initialize Next.js router for navigation
  // This allows us to programmatically navigate to other pages
  const router = useRouter()

  // State to track which social media item was copied to clipboard
  // null means nothing is copied, string value indicates which item was copied
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  // State to track if user is navigating to intro page
  // Used to show loading spinner during navigation
  const [isNavigatingToIntro, setIsNavigatingToIntro] = useState(false)

  // State to track if user is navigating to projects page
  // Used to show loading spinner during navigation
  const [isNavigatingToProjects, setIsNavigatingToProjects] = useState(false)

  // Form state object containing all form input values
  // name: user's name input
  // email: user's email input
  // message: user's message input
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  // UI state for form submission
  // isSubmitting: boolean to track if form is currently being submitted
  // submitStatus: object containing submission result (success/error) and message
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null // Type of status: success, error, or none
    message: string // Status message to display to user
  }>({ type: null, message: "" })

  // Message modal state for mobile devices
  // isMessageModalOpen: controls visibility of the message input modal
  // tempMessage: temporary storage for message content while modal is open
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [tempMessage, setTempMessage] = useState("")

  // Computed property to check if form is valid for submission
  // Checks that all required fields have content (after trimming whitespace)
  // name must have at least 1 character
  // email must have at least 1 character
  // message must have at least 1 character
  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.message.trim().length > 0 &&
    formData.email.trim().length > 0

  // Helper function to get input border styling based on submit status
  const getInputBorderStyle = () => {
    if (submitStatus.type === "success") {
      return "border-green-500/70 focus:border-green-500/90"
    } else if (submitStatus.type === "error") {
      return "border-red-500/70 focus:border-red-500/90"
    } else {
      return "border-purple-500/20 focus:border-purple-500/50"
    }
  }

  // Effect hook that runs when component mounts
  // Clears the contact loading state to indicate this page has finished loading
  // setContactLoading is in the dependency array to ensure it's stable
  useEffect(() => {
    setContactLoading(false)
  }, [setContactLoading])

  // Navigation handler for intro page
  // This function is called when user clicks the Profile button
  const handleIntroNavigation = async () => {
    // Set loading state to true to show spinner
    setIsNavigatingToIntro(true)
    // Set intro page loading state to true
    setIntroLoading(true)

    // Small delay to show the loading state to user
    // This creates a better UX by showing the loading animation
    // await new Promise((resolve) => setTimeout(resolve, 100))

    // Navigate to the intro page using Next.js router
    router.push("/intro")
  }

  // Navigation handler for projects page
  // This function is called when user clicks the Projects button
  const handleProjectsNavigation = async () => {
    // Set loading state to true to show spinner
    setIsNavigatingToProjects(true)
    // Set projects page loading state to true
    setProjectsLoading(true)

    // Small delay to show the loading state to user
    // This creates a better UX by showing the loading animation
    // await new Promise((resolve) => setTimeout(resolve, 100))

    // Construct URL with query parameters for GitHub repositories
    // Get GitHub repos from userData or use empty array as fallback
    const githubReposParam = (userData?.githubRepos || []).join(",")
    // Create URL with GitHub repos as query parameter if they exist
    const url = githubReposParam
      ? `/projects?githubRepos=${encodeURIComponent(githubReposParam)}`
      : "/projects"

    // Navigate to the projects page with the constructed URL
    router.push(url)
  }

  // Function to copy text to clipboard
  // This is used for social media links and contact information
  const handleCopy = async (text: string, itemName: string) => {
    try {
      // Use the modern Clipboard API to copy text
      await navigator.clipboard.writeText(text)
      // Set the copied item to show success feedback
      setCopiedItem(itemName)
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedItem(null), 500) // Reset after 2 seconds
    } catch (err) {
      // Log error if clipboard operation fails
      console.error("Failed to copy: ", err)
    }
  }

  // Generic input change handler for all form inputs
  // This function updates the form data when user types in any input field
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Extract the input name and value from the event
    const { name, value } = e.target
    // Update form data using functional update to ensure we get latest state
    setFormData((prev) => ({
      ...prev, // Spread existing form data
      [name]: value, // Update the specific field that changed
    }))
  }

  // Message modal handlers for mobile devices
  // Opens the message input modal and copies current message to temp storage
  const openMessageModal = () => {
    // Copy current message to temporary storage
    setTempMessage(formData.message)
    // Show the modal
    setIsMessageModalOpen(true)
  }

  // Closes the message modal and saves the temporary message back to form data
  const closeMessageModal = () => {
    // Update form data with the temporary message content
    setFormData((prev) => ({
      ...prev, // Keep existing form data
      message: tempMessage, // Update message with temp content
    }))
    // Hide the modal
    setIsMessageModalOpen(false)
  }

  // Handles changes in the message modal textarea
  // Updates the temporary message state as user types
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update temporary message with new value
    setTempMessage(e.target.value)
  }

  // Form submission handler - called when user submits the contact form
  // This function handles the entire form submission process including API calls
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent the default form submission behavior (page reload)
    e.preventDefault()
    // Set submitting state to true to show loading spinner
    setIsSubmitting(true)
    // Clear any previous status messages
    setSubmitStatus({ type: null, message: "" })

    try {
      // Log form data for debugging purposes
      console.log("Submitting form with data:", {
        ...formData, // Spread the form data (name, email, message)
        userId: userData?.username || "jatin", // Get username from context or use default
        adminEmail: userData?.email || "jatin.prakash.2720@gmail.com", // Get admin email or use default
      })

      // Make API call to the contact endpoint
      const response = await fetch("/api/contact", {
        method: "POST", // Use POST method for form submission
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify({
          // Convert data to JSON string
          ...formData, // Include all form fields
          userId: userData?.username || "jatin", // Dynamic based on portfolio owner
          adminEmail: userData?.email || "jatin.prakash.2720@gmail.com", // Dynamic admin email
        }),
      })
      console.log("Response:", response)
      // Log response details for debugging
      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)

      // Check if the response was successful (status 200-299)
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }

      // Parse the JSON response from the API
      const result: ApiResponse = await response.json()
      console.log("Response result:", result)

      // Check if the API call was successful
      if (result.success) {
        // Reset form to empty state
        setFormData({ name: "", email: "", message: "" })

        // Show success state on button (no popup notification)
        setSubmitStatus({
          type: "success",
          message:
            "Message sent successfully! Check your email for confirmation.",
        })

        // Reset success state after 3 seconds
        setTimeout(() => {
          setSubmitStatus({ type: null, message: "" })
        }, 2000)
      } else {
        // Show error message from API response
        setSubmitStatus({
          type: "error",
          message:
            result.message || "Failed to send message. Please try again.",
        })

        // Reset error state after 5 seconds to hide the message
        setTimeout(() => {
          setSubmitStatus({ type: null, message: "" })
        }, 2000)
      }
    } catch (error) {
      // Log the error for debugging
      console.error("Error submitting form:", error)

      // Default error message for network issues
      let errorMessage =
        "Network error. Please check your connection and try again."

      // Check if error is an Error instance to provide specific error messages
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          // Specific message for network connectivity issues
          errorMessage =
            "Cannot connect to server. Please check your internet connection."
        } else if (error.message.includes("HTTP error")) {
          // Specific message for server errors
          errorMessage = "Server error. Please try again later."
        } else {
          // Use the actual error message
          errorMessage = error.message
        }
      }

      // Show error message to user
      setSubmitStatus({
        type: "error",
        message: errorMessage,
      })

      // Reset error state after 5 seconds to hide the message
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" })
      }, 2000)
    } finally {
      // Always set submitting to false, regardless of success or failure
      setIsSubmitting(false)
    }
  }
  // Return the JSX that renders the contact page
  return (
    <>
      {/* Inline styles for webkit autofill customization */}
      {/* This ensures autofilled form fields maintain the dark theme */}
      <style jsx>{`
        /* Target all autofill states for input and textarea elements */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:active {
          /* Override browser's default yellow autofill background */
          -webkit-box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5) inset !important;
          /* Set text color to white for visibility */
          -webkit-text-fill-color: white !important;
          /* Set background to semi-transparent black */
          background-color: rgba(0, 0, 0, 0.5) !important;
          /* Prevent background color changes during autofill */
          transition: background-color 5000s ease-in-out 0s;
        }

        /* Ensure non-autofilled inputs also have dark background */
        input:not(:-webkit-autofill),
        textarea:not(:-webkit-autofill) {
          background-color: rgba(0, 0, 0, 0.5) !important;
        }

        /* Fix text color when browser validation indicators appear */
        input:invalid,
        input:invalid:focus,
        input:invalid:hover,
        input:invalid:active,
        textarea:invalid,
        textarea:invalid:focus,
        textarea:invalid:hover,
        textarea:invalid:active {
          color: white !important;
          -webkit-text-fill-color: white !important;
        }

        /* Specifically target email inputs with validation */
        input[type="email"]:invalid,
        input[type="email"]:invalid:focus,
        input[type="email"]:invalid:hover,
        input[type="email"]:invalid:active {
          color: white !important;
          -webkit-text-fill-color: white !important;
        }

        /* Override any browser default validation styling */
        input:user-invalid,
        input:user-invalid:focus,
        textarea:user-invalid,
        textarea:user-invalid:focus {
          color: white !important;
          -webkit-text-fill-color: white !important;
        }
      `}</style>

      {/* Main container div - full screen height with dark theme */}
      <div className="h-screen flex relative transition-colors duration-300 bg-black text-white">
        {/* Background animation layer - positioned absolutely behind content */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Suspense wrapper for lazy-loaded PixelBlast component */}
          <Suspense fallback={null}>
            {/* PixelBlast component creates animated background effect */}
            <PixelBlast
              variant="circle" // Use circular pattern
              pixelSize={4} // Size of individual pixels
              color="#A855F7" // Purple color for pixels
              patternScale={2} // Scale of the pattern
              patternDensity={0.8} // How dense the pattern is
              pixelSizeJitter={0.3} // Random variation in pixel size
              enableRipples={false} // Disable ripple effects
              liquid={false} // Disable liquid animation
              speed={0.3} // Animation speed
              edgeFade={0.15} // Fade effect at edges
              transparent // Make background transparent
            />
          </Suspense>
        </div>

        {/* Additional background overlay for depth */}
        <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-300 bg-purple-900/10" />

        {/* Main content area - positioned above background layers */}
        <main
          className="relative z-10 w-screen overflow-hidden p-1"
          style={{ height: "100dvh" }} // Use dynamic viewport height for mobile compatibility
        >
          {/* Responsive grid layout for different screen sizes */}
          {/* Mobile: 6 columns x 5 rows, Tablet: 8 columns x 5 rows, Desktop: 8 columns x 6 rows */}
          <div
            className="relative grid grid-cols-6 grid-rows-5 sm:grid-cols-6 sm:grid-rows-5 md:grid-cols-8 md:grid-rows-5 lg:grid-rows-6 p-2"
            style={{
              gap: "10px", // Space between grid items
              padding: "6px", // Inner padding of the grid container
              width: "100%", // Full width of the container
              height: "100%", // Full height of the container
              boxSizing: "border-box", // Include padding in width/height calculations
            }}
          >
            {/* Contact Form Container */}
            {/* Responsive positioning: Mobile: 6x3 (cols 1-6, rows 2-4), Tablet: 6x5 (cols 1-6, rows 1-5), Desktop: 6x6 (cols 1-6, rows 1-6) */}
            <div className="col-span-6 row-span-3 col-start-1 row-start-2 sm:col-span-6 sm:row-span-3 sm:col-start-1 sm:row-start-2 md:col-span-6 md:row-span-5 lg:row-span-6 md:col-start-1 md:row-start-1 lg:row-start-1 rounded-2xl md:rounded-3xl border-2 p-3 md:p-6 lg:p-8 flex flex-col z-10 group hover:border-transparent transition-all duration-300 hover:bg-opacity-80 relative backdrop-blur-sm bg-[#0F0F0F]/80 border-purple-500/20">
              {/* Form Header Section - Only visible on medium screens and larger */}
              <div className="hidden md:block">
                {/* Main heading for the contact form */}
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 text-white">
                  Let&apos;s Collaborate
                </h2>
                {/* Subtitle explaining the purpose of the form */}
                <p className="text-[11px] md:text-sm lg:text-base text-white/60 mb-4 md:mb-6">
                  Have an idea? Want to work together? Drop me a message!
                </p>
              </div>

              {/* Contact Form Element */}
              <form
                onSubmit={handleSubmit} // Handle form submission
                className="flex-1 flex flex-col gap-3 md:gap-4" // Full height with vertical spacing
              >
                {/* Error Message Display - Only show errors, success is shown on button */}
                {/* {submitStatus.type === "error" && (
                  <div className="p-3 rounded-xl text-sm font-medium bg-red-500/20 border border-red-400/40 text-red-400">
                    {submitStatus.message}
                  </div>
                )} */}

                {/* Mobile Form Layout - Only visible on mobile devices (hidden on md and larger) */}
                {/* Uses a 6 column x 3 row grid for compact mobile layout */}
                <div className="md:hidden grid grid-cols-6 grid-rows-3 gap-2 h-full">
                  {/* Submit Button - Positioned in top-right corner (6th column, 1st row) */}
                  <div className="col-start-6 row-start-1 flex items-center justify-center">
                    <button
                      type="submit" // Submit the form when clicked
                      disabled={
                        isSubmitting || (!isFormValid && !submitStatus.type)
                      } // Disable if submitting or form invalid (but allow when showing status)
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isSubmitting
                          ? "bg-gray-500/20 border-gray-400/40 text-white cursor-not-allowed" // Loading state
                          : submitStatus.type === "success"
                          ? "bg-green-500/20 border-green-400/40 text-green-400" // Success state
                          : submitStatus.type === "error"
                          ? "bg-red-500/20 border-red-400/40 text-red-400" // Error state
                          : !isFormValid
                          ? "bg-gray-500/20 border-gray-400/40 text-white cursor-not-allowed" // Disabled state
                          : "bg-purple-500/20 border-purple-400/40 text-white hover:bg-purple-500/30 hover:border-purple-400/60" // Active state
                      }`}
                    >
                      {/* Conditional button content based on form state */}
                      {isSubmitting ? (
                        // Loading spinner when form is being submitted
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : submitStatus.type === "success" ? (
                        // Success checkmark icon with tooltip
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-5 h-5 text-green-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          <span className="text-xs text-green-400 mt-1 text-center">
                            Check Mailbox!
                          </span>
                        </div>
                      ) : submitStatus.type === "error" ? (
                        // Error X icon with retry text
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-5 h-5 text-red-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                          <span className="text-xs text-red-400 mt-1 text-center">
                            Retry
                          </span>
                        </div>
                      ) : (
                        // Default send arrow icon
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

                  {/* Name Input Field - Spans 5 columns in the first row */}
                  <div className="col-span-5 row-start-1 col-start-1 flex items-center justify-center">
                    <div className="relative w-full">
                      <input
                        type="text" // Text input type
                        id="name" // HTML id for accessibility
                        name="name" // Form field name for data binding
                        value={formData.name} // Controlled input value
                        onChange={handleInputChange} // Handle input changes
                        placeholder="Your name" // Placeholder text
                        required // Required field validation
                        minLength={2} // Minimum 2 characters
                        maxLength={100} // Maximum 100 characters
                        className={`w-full h-full px-3 py-4 rounded-lg bg-black/50 border text-white text-sm focus:outline-none transition-colors autofill:bg-black/50 autofill:text-white [&:-webkit-autofill]:bg-black/50 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.5)] ${getInputBorderStyle()}`}
                      />
                    </div>
                  </div>

                  {/* Email Input Field - Spans full width in the second row */}
                  <div className="col-span-6 row-start-2 col-start-1 flex items-center justify-center">
                    <div className="relative w-full">
                      <input
                        type="email" // Email input type for validation
                        id="email" // HTML id for accessibility
                        name="email" // Form field name for data binding
                        value={formData.email} // Controlled input value
                        onChange={handleInputChange} // Handle input changes
                        placeholder="your.email@example.com" // Placeholder text
                        required // Required field validation
                        className={`w-full h-full px-3 py-4 rounded-lg bg-black/50 border text-white text-sm focus:outline-none transition-colors autofill:bg-black/50 autofill:text-white [&:-webkit-autofill]:bg-black/50 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.5)] ${getInputBorderStyle()}`}
                      />
                    </div>
                  </div>

                  {/* Message Button - Spans full width in the third row */}
                  <div className="col-span-6 row-start-3 flex items-center">
                    <button
                      type="button" // Button type (not submit)
                      onClick={openMessageModal} // Open message modal when clicked
                      className={`w-full h-full py-4 px-3 rounded-lg border-2 text-sm font-medium transition-all duration-300 flex items-center justify-center ${
                        formData.message.trim().length > 0
                          ? "bg-green-500/20 border-green-400/40 text-green-400" // Green when message exists
                          : "bg-purple-500/20 border-purple-400/40 text-white hover:bg-purple-500/30" // Purple when empty
                      }`}
                    >
                      {/* Dynamic button text based on message state */}
                      {formData.message.trim().length > 0
                        ? "Edit Message" // Show "Edit" if message exists
                        : "Write Message"}{" "}
                      // Show "Write" if message is empty
                    </button>
                  </div>
                </div>

                {/* Desktop Form Layout - Only visible on medium screens and larger */}
                <div className="hidden md:flex flex-1 flex-col gap-4">
                  {/* Desktop Form Inputs Container */}
                  <div className="grid grid-cols-1 gap-4">
                    {/* Name Input Field for Desktop */}
                    <div>
                      {/* Label for accessibility and user guidance */}
                      <label
                        htmlFor="name"
                        className="block text-[11px] md:text-sm font-medium mb-1 md:mb-2 text-white"
                      >
                        Name
                      </label>
                      <div className="relative">
                        <input
                          type="text" // Text input type
                          id="name" // HTML id for label association
                          name="name" // Form field name for data binding
                          value={formData.name} // Controlled input value
                          onChange={handleInputChange} // Handle input changes
                          placeholder="Your name" // Placeholder text
                          required // Required field validation
                          minLength={2} // Minimum 2 characters
                          maxLength={100} // Maximum 100 characters
                          className={`w-full px-3 md:px-4 py-2 md:py-3 pr-10 rounded-xl md:rounded-2xl bg-black/50 border text-white text-[11px] md:text-sm focus:outline-none transition-colors autofill:bg-black/50 autofill:text-white [&:-webkit-autofill]:bg-black/50 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.5)] ${getInputBorderStyle()}`}
                        />
                      </div>
                    </div>

                    {/* Email Input Field for Desktop */}
                    <div>
                      {/* Label for accessibility and user guidance */}
                      <label
                        htmlFor="email"
                        className="block text-[11px] md:text-sm font-medium mb-1 md:mb-2 text-white"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email" // Email input type for validation
                          id="email" // HTML id for label association
                          name="email" // Form field name for data binding
                          value={formData.email} // Controlled input value
                          onChange={handleInputChange} // Handle input changes
                          placeholder="your.email@example.com" // Placeholder text
                          required // Required field validation
                          className={`w-full px-3 md:px-4 py-2 md:py-3 pr-10 rounded-xl md:rounded-2xl bg-black/50 border text-white text-[11px] md:text-sm focus:outline-none transition-colors autofill:bg-black/50 autofill:text-white [&:-webkit-autofill]:bg-black/50 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.5)] ${getInputBorderStyle()}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message Input Field for Desktop */}
                  <div className="flex-1 flex flex-col">
                    {/* Label for accessibility and user guidance */}
                    <label
                      htmlFor="message-desktop"
                      className="block text-sm font-medium mb-2 text-white"
                    >
                      Message
                    </label>
                    <div className="relative flex-1">
                      <textarea
                        id="message-desktop" // Unique id for desktop message field
                        name="message" // Form field name for data binding
                        value={formData.message} // Controlled input value
                        onChange={handleInputChange} // Handle input changes
                        placeholder="Share your ideas..." // Placeholder text
                        required // Required field validation
                        minLength={10} // Minimum 10 characters
                        maxLength={2000} // Maximum 2000 characters
                        rows={8} // Initial number of rows
                        className={`w-full h-48 px-4 py-3 pr-10 rounded-2xl bg-black/50 border text-white text-sm focus:outline-none transition-colors resize-none autofill:bg-black/50 autofill:text-white [&:-webkit-autofill]:bg-black/50 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.5)] ${getInputBorderStyle()}`}
                      />
                    </div>
                  </div>

                  {/* Submit Button for Desktop */}
                  <button
                    type="submit" // Submit the form when clicked
                    disabled={
                      isSubmitting || (!isFormValid && !submitStatus.type)
                    } // Disable if submitting or form invalid (but allow when showing status)
                    className={`w-full py-3 rounded-2xl border-2 text-base font-semibold transition-all duration-300 ${
                      isSubmitting
                        ? "bg-gray-500/20 border-gray-400/40 text-white cursor-not-allowed" // Loading state
                        : submitStatus.type === "success"
                        ? "bg-green-500/20 border-green-400/40 text-green-400" // Success state
                        : submitStatus.type === "error"
                        ? "bg-red-500/20 border-red-400/40 text-red-400" // Error state
                        : !isFormValid
                        ? "bg-gray-500/20 border-gray-400/40 text-white cursor-not-allowed" // Disabled state
                        : "bg-purple-500/20 border-purple-400/40 text-white hover:bg-purple-500/30 hover:border-purple-400/60" // Active state
                    }`}
                  >
                    {/* Conditional button content based on submission state */}
                    {isSubmitting ? (
                      // Loading state with spinner and text
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : submitStatus.type === "success" ? (
                      // Success state with checkmark and text
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Message Sent! Check your Mailbox
                      </div>
                    ) : submitStatus.type === "error" ? (
                      // Error state with X icon and text
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="w-4 h-4 text-red-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                        Enter Valid Email & Retry
                      </div>
                    ) : (
                      // Default submit text
                      "Send Message"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Information Section */}
            {/* Responsive positioning: Mobile: 6x1 (top row), Tablet: 6x1 (top row), Desktop: 2x3 (right side) */}
            <div className="col-span-6 row-span-1 col-start-1 row-start-1 sm:col-span-6 sm:row-span-1 sm:col-start-1 sm:row-start-1 md:col-span-2 md:row-span-3 md:col-start-7 md:row-start-1 lg:row-span-4 lg:col-span-2 lg:row-start-1 rounded-2xl md:rounded-3xl border-2 p-2 md:p-3 flex md:flex-col lg:grid lg:grid-cols-2 lg:grid-rows-3 items-center md:justify-center gap-2 md:gap-3 z-10 group hover:border-transparent transition-all duration-300 backdrop-blur-sm bg-[#0F0F0F]/80 border-purple-500/20">
              {/* GitHub Profile Button */}
              <button
                onClick={() =>
                  handleCopy(
                    userData?.socialLinks?.githubProfile || "jatinbuilds", // Get GitHub profile from context or use default
                    "github" // Identifier for copy feedback
                  )
                }
                className={`w-full h-full flex items-center justify-between gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 lg:col-span-1 lg:row-span-1  rounded-xl transition-all duration-300 group/icon relative overflow-hidden ${
                  copiedItem === "github"
                    ? "bg-green-500/20 border border-green-400/40" // Green when copied
                    : "bg-purple-500/10 hover:bg-purple-500/20" // Purple when not copied
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
                className={`w-full h-full flex items-center justify-between gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 lg:col-span-1 lg:row-span-1  rounded-xl transition-all duration-300 group/icon relative overflow-hidden ${
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
                className={`w-full h-full flex items-center justify-between gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 lg:col-span-1 lg:row-span-1 lg:col-start-2 lg:row-start-2  rounded-xl transition-all duration-300 group/icon relative overflow-hidden ${
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

        {/* Message Modal for Mobile Devices */}
        {/* This modal appears when user clicks "Write Message" on mobile */}
        {isMessageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blurred Background Overlay */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeMessageModal} // Close modal when background is clicked
            />

            {/* Modal Content Container */}
            <div className="relative w-full max-w-2xl bg-[#0F0F0F]/95 border border-purple-500/20 rounded-2xl p-6">
              {/* Modal Header with Title and Close Button */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Write Message
                </h3>
                <button
                  onClick={closeMessageModal} // Close modal when X is clicked
                  className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-white hover:bg-purple-500/30 transition-colors"
                >
                  {/* Close (X) Icon */}
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

              {/* Message Input Textarea */}
              <textarea
                value={tempMessage} // Controlled by temporary message state
                onChange={handleMessageChange} // Handle text changes
                placeholder="Share your ideas..." // Placeholder text
                className={`w-full h-64 px-4 py-3 rounded-xl bg-black/50 border text-white text-sm focus:outline-none transition-colors resize-none autofill:bg-black/50 autofill:text-white [&:-webkit-autofill]:bg-black/50 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.5)] ${getInputBorderStyle()}`}
              />

              {/* Modal Footer with Done Button */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={closeMessageModal} // Close modal and save message
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

/*
 * COMPONENT SUMMARY:
 *
 * This ContactPage component is a comprehensive contact form with the following features:
 *
 * 1. RESPONSIVE DESIGN:
 *    - Mobile: 6x5 grid layout with compact form
 *    - Tablet: 8x5 grid layout with expanded form
 *    - Desktop: 8x6 grid layout with full form and social links
 *
 * 2. FORM FUNCTIONALITY:
 *    - Controlled form inputs (name, email, message)
 *    - Real-time validation with visual indicators
 *    - Form submission with loading states
 *    - Success/error message display
 *    - Mobile modal for message input
 *
 * 3. SOCIAL MEDIA INTEGRATION:
 *    - GitHub, LinkedIn, Twitter, Email, Phone buttons
 *    - One-click copy to clipboard functionality
 *    - Visual feedback when items are copied
 *    - Dynamic content from user context
 *
 * 4. NAVIGATION:
 *    - Profile button (navigates to /intro)
 *    - Projects button (navigates to /projects with GitHub repos)
 *    - Loading states during navigation
 *
 * 5. UI/UX FEATURES:
 *    - Animated background with PixelBlast component
 *    - Dark theme with purple accents
 *    - Smooth transitions and hover effects
 *    - Accessibility features (labels, ARIA attributes)
 *    - Autofill styling for dark theme
 *
 * 6. STATE MANAGEMENT:
 *    - Form data state
 *    - UI state (loading, submission status)
 *    - Modal state for mobile message input
 *    - Copy feedback state
 *    - Navigation loading states
 *
 * The component uses React hooks for state management, Next.js for routing,
 * and Tailwind CSS for styling with a focus on responsive design and
 * user experience.
 */
