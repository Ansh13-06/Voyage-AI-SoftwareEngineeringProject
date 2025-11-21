// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFpnord8PvFOsOgx63CKs-KZM06diXpdg",
  authDomain: "voyage-ai-c0e4b.firebaseapp.com",
  projectId: "voyage-ai-c0e4b",
  storageBucket: "voyage-ai-c0e4b.firebasestorage.app",
  messagingSenderId: "725713017955",
  appId: "1:725713017955:web:0e78579bdf2d1b71e22c56",
  measurementId: "G-WCXLBF9709"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);