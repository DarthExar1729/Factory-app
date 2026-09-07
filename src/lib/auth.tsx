import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, getUserRole } from './firebase';

interface AuthContextType {
  user: User | null;
  role: 'admin' | 'manager' | null;
  loading: boolean;
  logout: () => Promise<void>;
  loginAsDemo: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  logout: async () => {},
  loginAsDemo: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'manager' | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(localStorage.getItem('demo_mode') === 'true');

  useEffect(() => {
    if (isDemo) {
      setUser({ email: 'demo@factorysync.com', uid: 'demo-admin-uid' } as User);
      setRole('admin');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRole = await getUserRole(currentUser.uid);
        setRole(userRole as 'admin' | 'manager');
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemo]);

  const logout = async () => {
    if (isDemo) {
      localStorage.removeItem('demo_mode');
      setIsDemo(false);
      setUser(null);
      setRole(null);
    } else {
      await signOut(auth);
    }
  };

  const loginAsDemo = () => {
    localStorage.setItem('demo_mode', 'true');
    setIsDemo(true);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout, loginAsDemo }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
