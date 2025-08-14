import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { productionConfig } from '@/config/production';

// Environment variables (kept as comments for reference):
// NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDlGIXeOtusP7iP7m6qgKmBH1xo8ulVJFI
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=teamblitz-45f98.firebaseapp.com
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=teamblitz-45f98
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=teamblitz-45f98.firebasestorage.app
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=6089062028
// NEXT_PUBLIC_FIREBASE_APP_ID=1:6089062028:web:e37f0984ab0de972d0eda9
// NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-0WJGVFZQNP

const firebaseConfig = {
  apiKey: productionConfig.firebaseApiKey,
  authDomain: productionConfig.firebaseAuthDomain,
  projectId: productionConfig.firebaseProjectId,
  storageBucket: productionConfig.firebaseStorageBucket,
  messagingSenderId: productionConfig.firebaseMessagingSenderId,
  appId: productionConfig.firebaseAppId,
  measurementId: productionConfig.firebaseMeasurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;