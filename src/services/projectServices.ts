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
      return null
    }

    const projectsRef = collection(db, "projects")

    const q = query(projectsRef, where("userId", "==", username))
    const querySnapShot = await getDocs(q)

    if (querySnapShot.empty) {
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
    return null
  }
}

export async function getAllProjectsSelective(
  username: string
): Promise<AllProject | null> {
  try {
    const { db } = await connectionToFirebase()
    if (!db) {
      return null
    }

    const projectsRef = collection(db, "projects")

    // Create query to fetch projects
    const q = query(projectsRef, where("userId", "==", username))

    const querySnapShot = await getDocs(q)

    if (querySnapShot.empty) {
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
      return null
    }

    const projectRef = doc(db, "projects", projectId)

    const projectSnap = await getDoc(projectRef)
    if (!projectSnap.exists()) {
      return null
    }
    if (projectSnap.data()?.userId !== username) {
      return null
    }

    return projectSnap.data() as Project
  } catch (error) {
    return null
  }
}
