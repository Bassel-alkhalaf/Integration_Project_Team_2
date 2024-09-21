// register.api.ts

import { auth } from '../../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export const registerUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  bio?: string;
}) => {
  const { email, password, firstName, lastName, gender, bio } = userData;

  // Create user in Firebase Authentication
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Store additional user data in Firestore
  const db = getFirestore(); // Get Firestore instance
  await setDoc(doc(db, 'users', user.uid), {
    id: user.uid,
    email: user.email,
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    bio: bio || '',
    createdAt: new Date().toISOString()
  });

  return user;
};
