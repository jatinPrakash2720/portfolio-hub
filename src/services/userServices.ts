import { connectionToFirebase } from "@/lib/dbConnect"
import { User } from "@/models/User"
import { doc, getDoc } from "firebase/firestore"

export async function getUser(username: string): Promise<User | null> {
  try {
    const { db } = await connectionToFirebase()
    if (!db) {
      return null
    }
    const userRef = doc(db, "users", username)

    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
      return null
    }

    const userData = userSnap.data() as User
    return userData
  } catch {
    return null
  }
}

// I will add other routes later,
