
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADbNmz7desOKC6uEAK6WH2jcW6WvmW4eE",
  authDomain: "vivariumsop.firebaseapp.com",
  projectId: "vivariumsop",
  storageBucket: "vivariumsop.appspot.com",
  messagingSenderId: "359319363724",
  appId: "1:359319363724:web:6f04b181ed9b1626b6dba9",
  measurementId: "G-PZ7H4ZX7GE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
