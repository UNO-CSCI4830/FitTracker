import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6v1tUd7lTKtLxVAp7gumgwxZGeUXR6Hs",
  authDomain: "fittracker-58ff7.firebaseapp.com",
  projectId: "fittracker-58ff7",
  storageBucket: "fittracker-58ff7.appspot.com",
  messagingSenderId: "675132583684",
  appId: "1:675132583684:web:12a37de8a6798586446a51"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);