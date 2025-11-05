import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleSession(session);
      setLoading(false);
      // subscribe to auth changes
      const { data: sub } = supabase.auth.onAuthStateChange(async (_event, sessionNow) => {
        await handleSession(sessionNow);
      });
      return () => {
        sub.subscription.unsubscribe();
      };
    };
    const cleanupPromise = init();
    return () => { void cleanupPromise; };
  }, []);

  const handleSession = async (session: import('@supabase/supabase-js').Session | null) => {
    if (!session?.user) {
      setUser(null);
      return;
    }
    const authUser = session.user;
    // fetch profile to determine role and name
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('full_name, role, phone')
      .eq('id', authUser.id)
      .maybeSingle();
    const role = (profileRow?.role as 'admin' | 'customer' | null) || 'customer';
    const profile: User = {
      id: authUser.id,
      name: profileRow?.full_name || authUser.email || 'User',
      email: authUser.email || '',
      role,
      phone: profileRow?.phone || undefined,
    };
    setUser(profile);
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await handleSession(data.session);
      toast.success('Welcome back!');
      navigate((user?.role === 'admin') ? '/admin/dashboard' : '/');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name: string, phone: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, phone } } });
      if (error) throw error;
      // ensure profile row
      await supabase.from('profiles').upsert({ id: data.user?.id, full_name: name, phone }, { onConflict: 'id' });
      await handleSession(data.session);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    supabase.auth.signOut().finally(() => {
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

