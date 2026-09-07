import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, getUserData } from './firebase';

interface AuthContextType {
  user: User | null;
  role: 'admin' | 'manager' | null;
  permissions: string[];
  loading: boolean;
  logout: () => Promise<void>;
  loginAsDemo: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  permissions: [],
  loading: true,
  logout: async () => {},
  loginAsDemo: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'manager' | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(localStorage.getItem('demo_mode') === 'true');

  useEffect(() => {
    if (isDemo) {
      setUser({ email: 'demo@factorysync.com', uid: 'demo-admin-uid' } as User);
      setRole('admin');
      setPermissions(['employees', 'attendance', 'production', 'inventory', 'sales', 'users']);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userData = await getUserData(currentUser.uid);
        setRole(userData?.role as 'admin' | 'manager');
        setPermissions(userData?.permissions || []);
      } else {
        setRole(null);
        setPermissions([]);
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
      setPermissions([]);
    } else {
      await signOut(auth);
    }
  };

  const loginAsDemo = () => {
    localStorage.setItem('demo_mode', 'true');
    setIsDemo(true);
  };

  return (
    <AuthContext.Provider value={{ user, role, permissions, loading, logout, loginAsDemo }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
