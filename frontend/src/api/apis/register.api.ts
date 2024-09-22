// register.api.ts

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';
import { auth } from '../../config/firebaseConfig';

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
    Id: user.uid,
    Email: user.email,
    FirstName: firstName,
    LastName: lastName,
    Gender: gender,
    Bio: bio || '',
    CreatedAt: Timestamp.now(),
  });

  return user;
};
