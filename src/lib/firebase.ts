// Firebase configuration for ValorantGuides
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzZIn826VMgjclSRixak-zzgHY9XBDhUc",
  authDomain: "playvalorantguides-665a1.firebaseapp.com",
  projectId: "playvalorantguides-665a1",
  storageBucket: "playvalorantguides-665a1.firebasestorage.app",
  messagingSenderId: "948821514198",
  appId: "1:948821514198:web:a606462eb0ff32106a3677",
  measurementId: "G-9YJ2EDRYHL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
