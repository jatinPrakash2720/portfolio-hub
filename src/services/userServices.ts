import { connectionToFirebase } from "@/lib/dbConnect"
import { User } from "@/models/User"
import { doc, getDoc } from "firebase/firestore"

export async function getUser(username: string): Promise<User | null> {
  try {
    console.log("Fetching user data from Firebase for:", username)
    const { db } = await connectionToFirebase()
    if (!db) {
      console.error(
        "Erroring while fetching db from connectionToFirebase from getUser()"
      )
      return null
    }
    const userRef = doc(db, "users", username)

    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
      console.log("No Such Document! from getUser()")
      return null
    }

    const userData = userSnap.data() as User
    console.log("User data fetched from Firebase:", userData)

    return userData
  } catch (error) {
    console.error("Error: Internal Error from getUser():", error)
    return null
  }
}

// I will add other routes later,
