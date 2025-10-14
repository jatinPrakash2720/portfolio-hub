import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resume - Jatin Prakash",
  description: "Jatin Prakash's Resume and Portfolio",
}

export default function ResumePage() {
  return (
    <div className="h-screen w-full bg-black">
      <iframe
        src="/resumes/Jatin-Prakash.pdf"
        className="w-full h-full border-0"
        title="Jatin Prakash Resume"
      />
    </div>
  )
}
