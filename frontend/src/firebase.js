import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.VITE_FIREBASE_API_KEY,
  projectId: import.meta.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
