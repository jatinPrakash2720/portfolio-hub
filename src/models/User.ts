import { z } from "zod"

export const UserSchema = z.object({
  id: z.string().optional().describe("Firebase Id of the User."),
  username: z
    .string()
    .min(3, { message: "Username should have at least 3 characters." })
    .max(20, { message: "Username should not exceed 20 characters." })
    .describe("Unique username for the user."),
  fullName: z.string().describe("FullName of the user."),
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .describe("Email Address of the user."),
  phone: z.string().optional().describe("Phone number of the user."),
  headline: z.string().describe("One Line description of User"),
  bio: z
    .string()
    .min(20, { message: "Bio must have at least 30 characters." })
    .max(1000, { message: "Bio must not exceed 1000 characters." })
    .describe("Bio of the User."),
  profilePictureUrl: z.string().describe("Profile Picture of the User"),
  portfolioDomain: z.string().describe("Domain of the User."),
  socialLinks: z.object({
    githubProfile: z.string().describe("Github Profile link of the User."),
    linkedInProfile: z.string().describe("Linked Profile link of the User."),
    leetcodeProfile: z.string().describe("Leetcode Profile link of the User."),
    twitterProfile: z
      .string()
      .optional()
      .describe("Twitter Profile link of the User."),
  }),

  projects: z
    .array(z.string().describe("Project Id of the User."))
    .describe("Projects Id of the User."),
  techStack: z.array(z.string()).describe("Tech Stack of the User."),
  githubRepos: z.array(z.string()).describe("Github Repos of the User."),
})

export type User = z.infer<typeof UserSchema>
