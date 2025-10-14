import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resume - Jatin Prakash",
  description: "Jatin Prakash's Resume and Portfolio",
}

export default function ResumePage() {
  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-2xl mb-4">Resume - Jatin Prakash</h1>
        <p className="text-white/60 mb-6">
          Click the button below to view or download the resume
        </p>
        <a
          href="/Jatin-Prakash.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          View Resume
        </a>
      </div>
    </div>
  )
}
