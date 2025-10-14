"use client"

import { useState, useEffect } from "react"
import { ContactResponse } from "@/models/ContactResponse"

export default function ContactResponsesPage() {
  const [responses, setResponses] = useState<ContactResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResponses()
  }, [])

  const fetchResponses = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/contact/responses?admin=true")
      const data = await response.json()

      if (data.success && data.data) {
        setResponses(data.data)
      } else {
        setError(data.message || "Failed to fetch responses")
      }
    } catch (err) {
      setError("Network error")
      console.error("Error fetching responses:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Contact Responses</h1>
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3">Loading responses...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Contact Responses</h1>
          <div className="bg-red-500/20 border border-red-400/40 text-red-400 p-4 rounded-lg">
            Error: {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Contact Responses</h1>
          <button
            onClick={fetchResponses}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>

        {responses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No contact responses yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {responses.map((response) => (
              <div
                key={response.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-400">
                      {response.name}
                    </h3>
                    <p className="text-gray-400">{response.email}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Portfolio: {response.userId}</p>
                    <p>
                      {response.dateOfResponse} at {response.timeOfResponse}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {response.message}
                  </p>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`mailto:${response.email}?subject=Re: Your message from portfolio&body=Hi ${response.name},%0D%0A%0D%0AThank you for reaching out through my portfolio.`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                  >
                    Reply via Email
                  </a>
                  <a
                    href={`https://linkedin.com/in/jatinbuilds`}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors text-sm"
                  >
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
