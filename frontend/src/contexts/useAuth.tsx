// contexts/useAuth.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextProps {
  user: User | null;
  accessToken: string | null;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  accessToken: null,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const token = await currentUser.getIdToken();
        setAccessToken(token);
      } else {
        setAccessToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null); // Clear user after logout
    setAccessToken(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
