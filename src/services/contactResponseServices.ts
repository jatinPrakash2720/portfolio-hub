import {
  ContactResponse,
  ContactResponseSchema,
  validateContactForm,
} from "../models/ContactResponse"
import { ApiResponse } from "../types/ApiResponse"
import { connectionToFirebase } from "@/lib/dbConnect"
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore"

export async function saveContactResponse(
  contactData: Omit<ContactResponse, "id" | "createdAt" | "updatedAt">
): Promise<ApiResponse> {
  try {
    // Validate the contact data
    const validatedData = ContactResponseSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    }).parse(contactData)

    // Prepare data for Firestore
    const firestoreData = {
      ...validatedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    // Save to Firestore
    const { db } = await connectionToFirebase()
    if (!db) {
      return {
        success: false,
        message: "Failed to connect to Firebase",
      }
    }
    const docRef = await addDoc(
      collection(db, "contactresponses"),
      firestoreData
    )

    return {
      success: true,
      message: "Contact response saved successfully",
      data: { id: docRef.id },
    } as ApiResponse
  } catch (error) {
    return {
      success: false,
      message: "Failed to save contact response",
    }
  }
}

// export async function getContactResponsesByUserId(userId: string): Promise<{
//   success: boolean
//   data?: ContactResponse[]
//   message: string
//  }> {
//   try {
//     const q = query(
//       collection(db, "contactresponses"),
//       where("userId", "==", userId),
//       orderBy("createdAt", "desc")
//     )

//     const querySnapshot = await getDocs(q)
//     const userResponses: ContactResponse[] = []

//     querySnapshot.forEach((doc) => {
//       const data = doc.data()
//       userResponses.push({
//         id: doc.id,
//         name: data.name,
//         email: data.email,
//         message: data.message,
//         dateOfResponse: data.dateOfResponse,
//         timeOfResponse: data.timeOfResponse,
//         userId: data.userId,
//         createdAt: data.createdAt?.toDate(),
//         updatedAt: data.updatedAt?.toDate(),
//       })
//     })

//     return {
//       success: true,
//       data: userResponses,
//       message: `Found ${userResponses.length} contact responses for user ${userId}`,
//     }
//   } catch (error) {
//     return {
//       success: false,
//       message: "Failed to fetch contact responses",
//     }
//   }
// }

// export async function getAllContactResponses(): Promise<{
//   success: boolean
//   data?: ContactResponse[]
//   message: string
// }> {
//   try {
//     const q = query(
//       collection(db, "contactresponses"),
//       orderBy("createdAt", "desc")
//     )

//     const querySnapshot = await getDocs(q)
//     const allResponses: ContactResponse[] = []

//     querySnapshot.forEach((doc) => {
//       const data = doc.data()
//       allResponses.push({
//         id: doc.id,
//         name: data.name,
//         email: data.email,
//         message: data.message,
//         dateOfResponse: data.dateOfResponse,
//         timeOfResponse: data.timeOfResponse,
//         userId: data.userId,
//         createdAt: data.createdAt?.toDate(),
//         updatedAt: data.updatedAt?.toDate(),
//       })
//     })

//     return {
//       success: true,
//       data: allResponses,
//       message: `Found ${allResponses.length} total contact responses`,
//     }
//   } catch (error) {
//     return {
//       success: false,
//       message: "Failed to fetch contact responses",
//     }
//   }
// }

// export async function getContactResponseById(id: string): Promise<{
//   success: boolean
//   data?: ContactResponse
//   message: string
// }> {
//   try {
//     const docRef = doc(db, "contactresponses", id)
//     const docSnap = await getDoc(docRef)

//     if (!docSnap.exists()) {
//       return {
//         success: false,
//         message: "Contact response not found",
//       }
//     }

//     const data = docSnap.data()
//     const contactResponse: ContactResponse = {
//       id: docSnap.id,
//       name: data.name,
//       email: data.email,
//       message: data.message,
//       dateOfResponse: data.dateOfResponse,
//       timeOfResponse: data.timeOfResponse,
//       userId: data.userId,
//       createdAt: data.createdAt?.toDate(),
//       updatedAt: data.updatedAt?.toDate(),
//     }

//     return {
//       success: true,
//       data: contactResponse,
//       message: "Contact response found",
//     }
//   } catch (error) {
//     return {
//       success: false,
//       message: "Failed to fetch contact response",
//     }
//   }
// }

// export async function deleteContactResponse(id: string): Promise<ApiResponse> {
//   try {
//     const docRef = doc(db, "contactresponses", id)
//     await deleteDoc(docRef)

//     return {
//       success: true,
//       message: "Contact response deleted successfully",
//     }
//   } catch (error) {
//     return {
//       success: false,
//       message: "Failed to delete contact response",
//     }
//   }
// }

// Helper function to validate contact form data before processing
export function validateContactFormData(data: unknown) {
  try {
    return validateContactForm(data)
  } catch (error) {
    throw new Error(`Invalid contact form data: ${error}`)
  }
}
