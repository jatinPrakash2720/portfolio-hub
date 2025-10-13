"use client"

import { lazy, Suspense } from "react"
// Lazy load the LogoLoop component
const LogoLoop = lazy(() => import("../../ui/LogoLoop"))

export default function LogoLoopClient({ techStack }: { techStack: string[] }) {
  // Default logos for the background animation
  // const defaultLogos = [
  //   { src: "/vercel.png", alt: "Vercel", width: 100, height: 40 },
  //   { src: "/file.png", alt: "File", width: 100, height: 40 },
  //   { src: "/globe.png", alt: "Globe", width: 100, height: 40 },
  //   { src: "/window.png", alt: "Window", width: 100, height: 40 },
  // ]

  const techLogos = [
    {
      node: (
        <img
          src="/images/icons/react.svg"
          alt="React"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "react",
      href: "https://react.dev",
    },
    {
      node: (
        <img
          src="/images/icons/nextjs.svg"
          alt="Next.js"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "next",
      href: "https://nextjs.org",
    },
    {
      node: (
        <img
          src="/images/icons/typescript.svg"
          alt="TypeScript"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "typescript",
      href: "https://www.typescriptlang.org",
    },
    {
      node: (
        <img
          src="/images/icons/tailwindcss.svg"
          alt="Tailwind CSS"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "tailwind",
      href: "https://tailwindcss.com",
    },
    {
      node: (
        <img
          src="/images/icons/nodejs.svg"
          alt="Node.js"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "node",
      href: "https://nodejs.org",
    },
    {
      node: (
        <img
          src="/images/icons/python.svg"
          alt="Python"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "python",
      href: "https://python.org",
    },
    {
      node: (
        <img
          src="/images/icons/javascript.svg"
          alt="JavaScript"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "javascript",
      href: "https://javascript.info",
    },
    {
      node: (
        <img
          src="/images/icons/mongodb.svg"
          alt="MongoDB"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "mongodb",
      href: "https://mongodb.com",
    },
    {
      node: (
        <img
          src="/images/icons/postgresql.svg"
          alt="PostgreSQL"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "postgresql",
      href: "https://postgresql.org",
    },
    {
      node: (
        <img
          src="/images/icons/docker.svg"
          alt="Docker"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "docker",
      href: "https://docker.com",
    },
    {
      node: (
        <img
          src="/images/icons/git.svg"
          alt="Git"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "git",
      href: "https://git-scm.com",
    },
    {
      node: (
        <img
          src="/images/icons/figma.svg"
          alt="Figma"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "figma",
      href: "https://figma.com",
    },
    {
      node: (
        <img
          src="/images/icons/express.svg"
          alt="Express.js"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "express",
      href: "https://expressjs.com",
    },
    {
      node: (
        <img
          src="/images/icons/graphql.svg"
          alt="GraphQL"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "graphql",
      href: "https://graphql.org",
    },
    {
      node: (
        <img
          src="/images/icons/redis.svg"
          alt="Redis"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "redis",
      href: "https://redis.io",
    },
    {
      node: (
        <img
          src="/images/icons/linux.svg"
          alt="Linux"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "linux",
      href: "https://linux.org",
    },
    {
      node: (
        <img
          src="/images/icons/vercel.svg"
          alt="Vercel"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "vercel",
      href: "https://vercel.com",
    },
    {
      node: (
        <img
          src="/images/icons/axios.svg"
          alt="Axios"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "axios",
      href: "https://axios-http.com",
    },
    {
      node: (
        <img
          src="/images/icons/cloudinary.svg"
          alt="Cloudinary"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "cloudinary",
      href: "https://cloudinary.com",
    },
    {
      node: (
        <img
          src="/images/icons/vite.svg"
          alt="Vite"
          className="w-8 h-8 brightness-0 invert"
        />
      ),
      title: "vite",
      href: "https://vite.dev",
    },
  ]
  const displayTechLogos = techLogos.filter((logo) =>
    techStack.includes(logo.title)
  )
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-6 h-6 bg-purple-500/20 rounded animate-pulse"></div>
            <div className="w-6 h-6 bg-purple-500/20 rounded animate-pulse"></div>
            <div className="w-6 h-6 bg-purple-500/20 rounded animate-pulse"></div>
            <div className="w-6 h-6 bg-purple-500/20 rounded animate-pulse"></div>
            <div className="w-6 h-6 bg-purple-500/20 rounded animate-pulse"></div>
            <div className="w-6 h-6 bg-purple-500/20 rounded animate-pulse"></div>
          </div>
        </div>
      }
    >
      <LogoLoop
        logos={displayTechLogos}
        speed={120}
        direction="left"
        logoHeight={32}
        gap={40}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#0F0F0F"
        ariaLabel="Technologies and tools"
        className="w-full"
      />
    </Suspense>
  )
}
