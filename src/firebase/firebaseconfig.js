// Import Firebase core
import { initializeApp } from "firebase/app";

// Services que tu utilises
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCJOmVVXA_GfvQn2v5fHEBON_hSAfGmgQ4",
  authDomain: "k2yy-30081.firebaseapp.com",
  projectId: "k2yy-30081",
  storageBucket: "k2yy-30081.firebasestorage.app",
  messagingSenderId: "1067093799891",
  appId: "1:1067093799891:web:14c9dbc8baa2a8fbf07526",
  measurementId: "G-6MGNKC6C02"
};

// Initialisation
const app = initializeApp(firebaseConfig);

// Services exportés
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;