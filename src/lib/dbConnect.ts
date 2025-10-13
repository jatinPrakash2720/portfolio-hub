import {
  initializeApp,
  getApps,
  getApp,
  FirebaseOptions,
  FirebaseApp,
} from "firebase/app"
import { getFirestore, Firestore } from "firebase/firestore"
import { getAuth, Auth } from "firebase/auth"
import { getStorage, FirebaseStorage } from "firebase/storage"

type FirebaseServices = {
  app?: FirebaseApp
  db?: Firestore
  auth?: Auth
  storage?: FirebaseStorage
}

const cached: FirebaseServices = {}
let connectionPromise: Promise<FirebaseServices> | null = null

function getFirebaseConfig(): FirebaseOptions {
  if (process.env.FIREBASE_CONFIG) {
    try {
      const config = JSON.parse(process.env.FIREBASE_CONFIG)
      if (config && config.apiKey) return config
    } catch (error) {
      console.warn("Warning: Failed to parse NEXT_PUBLIC_FIREBASE_CONFIG.")
    }
  }

  const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error(
      "Firebase configuration is incomplete. Check your .env.local file."
    )
  }

  return firebaseConfig
}

export async function connectionToFirebase(): Promise<FirebaseServices> {
  // Return cached connection if available
  if (cached.db && cached.auth && cached.storage) {
    console.log("Using cached firebase services")
    return cached
  }

  // Return existing connection promise if one is in progress
  if (connectionPromise) {
    console.log("Firebase connection already in progress, waiting...")
    return connectionPromise
  }

  // Create new connection promise
  connectionPromise = (async () => {
    try {
      const app = !getApps().length
        ? initializeApp(getFirebaseConfig())
        : getApp()

      const db = getFirestore(app, "jatinprakash")
      const auth = getAuth(app)
      const storage = getStorage(app)

      cached.app = app
      cached.db = db
      cached.auth = auth
      cached.storage = storage

      console.log("Firebase connected and services initialized!")
      return cached
    } catch (error) {
      console.error("Failed to connect Firebase: ", error)
      connectionPromise = null // Reset promise on error
      throw error
    }
  })()

  return connectionPromise
}
