// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "board-mates.firebaseapp.com",
  projectId: "board-mates",
  storageBucket: "board-mates.firebasestorage.app",
  messagingSenderId: "905433061309",
  appId: "1:905433061309:web:e0b312e8e28ecf877a24d4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
