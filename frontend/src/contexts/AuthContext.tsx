import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { firebaseApp } from '@/integrations/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string;
  address?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, phone: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const idTokenResult = await fbUser.getIdTokenResult(true);
        const isAdmin = Boolean(idTokenResult.claims?.admin || idTokenResult.claims?.role === 'admin');
        const profile: User = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email || 'User',
          email: fbUser.email || '',
          role: isAdmin ? 'admin' : 'customer',
        };
        setUser(profile);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const tokenResult = await cred.user.getIdTokenResult(true);
      const isAdmin = Boolean(tokenResult.claims?.admin || tokenResult.claims?.role === 'admin');
      const profile: User = {
        id: cred.user.uid,
        name: cred.user.displayName || cred.user.email || 'User',
        email: cred.user.email || '',
        role: isAdmin ? 'admin' : 'customer',
      };
      setUser(profile);
      toast.success('Welcome back!');
      navigate(isAdmin ? '/admin/dashboard' : '/');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name: string, phone: string, email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      // Save phone and full_name into Supabase profile
      try {
        const apiModule = await import('@/lib/api');
        await apiModule.default.updateProfileSupabase({ full_name: name, phone });
      } catch {}
      const tokenResult = await cred.user.getIdTokenResult(true);
      const isAdmin = Boolean(tokenResult.claims?.admin || tokenResult.claims?.role === 'admin');
      const profile: User = {
        id: cred.user.uid,
        name: name || cred.user.displayName || email,
        email: cred.user.email || email,
        role: isAdmin ? 'admin' : 'customer',
      };
      setUser(profile);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    signOut(auth).finally(() => {
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/');
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

