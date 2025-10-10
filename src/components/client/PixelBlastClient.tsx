"use client"

import { lazy, Suspense } from "react"

// Lazy load the TypeText component
const PixelBlast = lazy(() => import("../ui/PixelBlast"))

export default function PixelBlastClient() {

  return (
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
  )
}
