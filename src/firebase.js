import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyAUaeiD44r-JYrg4UX73PB6qgzWZcXekvo",
  authDomain: "cafe-app-60998.firebaseapp.com",
  projectId: "cafe-app-60998",
  storageBucket: "cafe-app-60998.firebasestorage.app",
  messagingSenderId: "1058307574084",
  appId: "1:1058307574084:web:76e3f309f170b4c263af11",
  measurementId: "G-NF714J1Q7G"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app);