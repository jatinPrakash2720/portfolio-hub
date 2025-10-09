import { connectionToFirebase } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Project } from "@/models/Project";

const usersToSeed = [
  {
    // NOTE: In a real app, this ID should come from Firebase Auth.
    // For seeding, we'll predefine it.
    username: "jatin",
    fullName: "Jatin Prakash",
    email: "jatin.prakash.2720@gmail.com",
    headline: "Full-Stack Developer",
    bio: "Versatile Full Stack Developer leveraging AI tools to build efficient, end-to-end web applications. My expertise spans front-end, back-end, and optimizing workflows through intelligent automation.",
    portfolioDomain: "portfolio.jatinbuilds.com",
    profilePictureUrl: "https://placehold.co/200x200/7C3AED/FFFFFF?text=JP",
  },
  
]

const projectsToSeed = [
  {
    authorId: "user-jatin-prakash", // Link to Jatin
    title: "Cloud-Native Analytics Platform",
    description:
      "A real-time data processing and analytics dashboard built with Next.js and deployed on Vercel.",
    technologies: ["Next.js", "Firebase", "Vercel"],
    coverImageUrl:
      "https://placehold.co/600x400/111827/FFFFFF?text=Project+One",
  },
  {
    authorId: "user-himanshu-verma", // Link to Himanshu
    title: "Interactive Design System UI Kit",
    description:
      "A comprehensive component library built in React and Storybook to ensure brand consistency.",
    technologies: ["React", "TypeScript", "Storybook"],
    coverImageUrl:
      "https://placehold.co/600x400/111827/FFFFFF?text=Project+Two",
  },
]


const { app, db } = await connectionToFirebase();

