import { connectionToFirebase } from "@/lib/dbConnect"
import { Project, AllProjectSchema, AllProject } from "@/models/Project"
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore"

export async function getAllProject(
  username: string
): Promise<Array<Project> | null> {
  try {
    const { db } = await connectionToFirebase()
    if (!db) {
      console.error(
        "Erroring while fetching db from connectionToFirebase from geAllProject()"
      )
      return null
    }

    const projectsRef = collection(db, "projects")

    const q = query(projectsRef, where("userId", "==", username))
    const querySnapShot = await getDocs(q)

    if (querySnapShot.empty) {
      console.log("No Such Document! from getAllProjects()")
      return null
    }
    return querySnapShot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Project)
    )
  } catch (error) {
    console.error("Error: Internal Error from getAllProject():", error)
    return null
  }
}

export async function getAllProjectsSelective(
  username: string
): Promise<AllProject | null> {
  try {
    const { db } = await connectionToFirebase()
    if (!db) {
      console.error(
        "Erroring while fetching db from connectionToFirebase from getAllProjectsSelective()"
      )
      return null
    }

    const projectsRef = collection(db, "projects")

    // Create query to fetch projects
    const q = query(projectsRef, where("userId", "==", username))

    const querySnapShot = await getDocs(q)

    if (querySnapShot.empty) {
      console.log("No Such Document! from getAllProjectsSelective()")
      return null
    }

    // Map documents to the required format and filter only needed fields
    const projects = querySnapShot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        userId: data.userId,
        liveUrl: data.liveUrl,
        sourceCodeUrl:
          data.soureCodeUrl || data.sourceCodeUrl || "https://github.com", // Handle both typo and correct spelling
        technologies: data.technologies,
      }
    })

    // Validate against AllProjectSchema
    const validatedData = AllProjectSchema.parse({ projects })

    return validatedData
  } catch (error) {
    console.error(
      "Error: Internal Error from getAllProjectsSelective():",
      error
    )
    return null
  }
}

export async function getProjectById(
  projectId: string,
  username: string
): Promise<Project | null> {
  try {
    const { db } = await connectionToFirebase()
    if (!db) {
      console.error(
        "Erroring while fetching db from connectionToFirebase from geProjectById()"
      )
      return null
    }

    const projectRef = doc(db, "projects", projectId)

    const projectSnap = await getDoc(projectRef)
    if (!projectSnap.exists()) {
      console.log("No such project found!")
      return null
    }
    if (projectSnap.data()?.userId !== username) {
      console.error("You can not access this project.")
      return null
    }

    return projectSnap.data() as Project
  } catch (error) {
    console.error("Error: Internal Error from getAllProject():", error)
    return null
  }
}
