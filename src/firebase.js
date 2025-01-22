import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8wCyVUDycXYDkh6LSx0w45PG4kstLTwg",
  authDomain: "chat-app-cx.firebaseapp.com",
  projectId: "chat-app-cx",
  storageBucket: "chat-app-cx.firebasestorage.app",
  messagingSenderId: "46520781132",
  appId: "1:46520781132:web:14f1cc37e321dd08d727e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
import { GoogleAuthProvider } from "firebase/auth";
export const googleProvider = new GoogleAuthProvider();
