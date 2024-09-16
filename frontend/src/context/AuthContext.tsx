import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth'; // Import Firebase types and methods
import { auth } from '../services/firebase'; // Import your initialized Firebase instance

// Define the types for the context
interface AuthContextProps {
  user: User | null; // The Firebase user object or null if not logged in
  login: (user: User) => void; // Accept a Firebase user object when logging in
  logout: () => void; // Logout the user
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthContext with a default undefined value
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Define the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Manage the authenticated user state

  // Function to handle login (usually called after Firebase authentication)
  const login = (user: User) => setUser(user);

  // Function to handle logout
  const logout = () => {
    setUser(null); // Clear user state
    auth.signOut(); // Sign out the user from Firebase
  };

  // Set up Firebase authentication listener (onAuthStateChanged)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user if logged in, or null if logged out
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
