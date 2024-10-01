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
  const [user, setUser] = useState<UserInfoT | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        const userInfo = await getUserInfo(currentUser.uid);

        const userData = { ...userInfo, email: currentUser.email } as UserInfoT;
        setUser(userData);
        console.log(token)
        setAccessToken(token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', token);
      } else {
        setUser(null);
        setAccessToken(null);
        localStorage.clear();
        queryClient.clear();
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null); // Clear user after logout
    setAccessToken(null);
    queryClient.clear();
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
