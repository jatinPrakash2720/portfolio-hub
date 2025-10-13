import { z } from "zod"

export const ProjectSchema = z
  .object({
    id: z.string().optional().describe("Firebase Id of the Project."),
    title: z.string().describe("Title of the Project."),
    userId: z.string().describe("User id of the developer of the Project"),
    description: z
      .string()
      .min(30, { message: "Description should have at least 30 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters." })
      .describe("Description of the Project."),
    imageUrls: z.array(z.string()).describe("All Images Urls of the Project."),
    liveUrl: z.string().describe("Live Deployed Url of the Project."),
    sourceCodeUrl: z.string().describe("Github Link of the Project."),
    technologies: z.array(z.string()).describe("List of Technology Used."),
  })
  .partial({ description: true, imageUrls: true })

export type Project = z.infer<typeof ProjectSchema>

export const SimpleProjectSchema = ProjectSchema.pick({
  id: true,
  title: true,
  userId: true,
  liveUrl: true,
  sourceCodeUrl: true,
  technologies: true,
}).partial({ id: true, sourceCodeUrl: true })

export const AllProjectSchema = z.object({
  projects: z.array(SimpleProjectSchema).describe("List of Projects."),
})

export type AllProject = z.infer<typeof AllProjectSchema>
export type SimpleProject = z.infer<typeof SimpleProjectSchema>
