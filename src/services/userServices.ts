import { connectionToFirebase } from "@/lib/dbConnect"
import { User } from "@/models/User"
import { doc, getDoc } from "firebase/firestore"

export async function getUser(username: string): Promise<User | null> {
  try {
    const { db } = await connectionToFirebase()
    if (!db) {
      console.error(
        "Erroring while fetching db from connectionToFirebase from getUser()"
      )
      return null
    }
    console.log("db :", db)

    const userRef = doc(db, "users", username)
    console.log("username :", username)
    console.log("userRef :", userRef)

    console.log("About to call getDoc...")
    const userSnap = await getDoc(userRef)
    console.log("userSnap :", userSnap)
    console.log("userSnap.exists() :", userSnap.exists())
    if (!userSnap.exists()) {
      console.log("No Such Document! from getUser()")
      return null
    }

    return userSnap.data() as User
  } catch (error) {
    console.error("Error: Internal Error from getUser():", error)
    return null
  }
}

// I will add other routes later,
