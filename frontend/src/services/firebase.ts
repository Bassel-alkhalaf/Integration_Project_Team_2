// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
// };

// const app = initializeApp(firebaseConfig); // Initialize Firebase
// export const auth = getAuth(app); // Export initialized auth object
// export const db = getFirestore(app); // Export initialized Firestore object

// // Enable offline persistence

// enableIndexedDbPersistence(db)
//   .catch((err) => {
//     if (err.code === 'failed-precondition') {
//       // Multiple tabs open, only one can have persistence enabled
//       console.error('Offline persistence failed: Multiple tabs open.');
//     } else if (err.code === 'unimplemented') {
//       // The current browser does not support all features required for offline persistence
//       console.error('Offline persistence is not available in this browser.');
//     }
//   });


import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // Import Realtime Database

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL, // Correct Realtime Database URL
};

const app = initializeApp(firebaseConfig); // Initialize Firebase
export const auth = getAuth(app); // Export initialized auth object
export const db = getDatabase(app); // Export initialized Realtime Database object
