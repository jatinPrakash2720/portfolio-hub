import { string, z } from "zod"
import { UserSchema } from "./User"

export const ProjectSchema = z.object({
  id: z.string().describe("Firebase Id of the Project."),
    title: z.string().describe("Title of the Project."),
    userId:z.string().describe("User id of the developer of the Project"),
  description: z
    .string()
    .min(30, { message: "Description should have at least 30 characters" })
    .max(1000, { message: "Description must not exceed 1000 characters." })
        .describe("Description of the Project."),
  imageUrls:z.array(z.string()).describe("All Images Urls of the Project."),
  videoUrl: z.string().describe("Tutorial Video of the Project."),
  liveUrl: z.string().describe("Live Deployed Url of the Project."),
  soureCodeUrl: z.string().describe("Github Link of the Project."),
  technologies: z.array(z.string()).describe("List of Technology Used."),
  finishedDate: z.date().describe("Finishing Date of the Project."),
})

export type Project = z.infer<typeof ProjectSchema>
