"use client"

import { lazy, Suspense } from "react"

// Lazy load the TypeText component
const TextType = lazy(() => import("../../ui/TypeText"))

interface TextTypeClientProps {
  text: string
}

export default function TextTypeClient({ text }: TextTypeClientProps) {
  return (
    <Suspense
      fallback={
        <div className="text-2xl text-white/60 animate-pulse">Loading...</div>
      }
    >
      <TextType
        text={text}
        as="h2"
        // className="text-2xl md:text-3xl text-white/90 font-medium"
        typingSpeed={80}
        pauseDuration={2000}
        showCursor={true}
        cursorCharacter="|"
        cursorClassName="text-purple-400"
        loop={true}
      />
    </Suspense>
  )
}
