// contexts/useAuth.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useQueryClient } from '@tanstack/react-query';
import { getUserInfo } from '../api';
import { UserInfoT } from '../types';

interface AuthContextProps {
  user: UserInfoT | null;
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
  const [user, setUser] = useState<UserInfoT | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        const userInfo = await getUserInfo(currentUser.uid);

        setUser({ ...userInfo, email: currentUser.email } as UserInfoT);
        console.log(token)
        setAccessToken(token);
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
