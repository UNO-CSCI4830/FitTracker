import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';  // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApqqfHihkHX46IFAXG4Wli5nvErmflsvc",
  authDomain: "fittracker-467e5.firebaseapp.com",
  projectId: "fittracker-467e5",
  storageBucket: "fittracker-467e5.appspot.com",
  messagingSenderId: "984504307957",
  appId: "1:984504307957:web:5dab6864121e87490b75bc"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
