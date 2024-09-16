import { auth } from './firebase'; // Import the initialized auth object
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in successfully:', userCredential.user);
      return userCredential.user; // Return the user information
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Throw error to handle it where the function is called
    }
  },

  register: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registered successfully:', userCredential.user);
      return userCredential.user; // Return the user information
    } catch (error) {
      console.error('Registration failed:', error);
      throw error; // Throw error to handle it where the function is called
    }
  }
};
