import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../services/supabase';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role?: 'patient' | 'doctor' | 'admin';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: 'patient' | 'doctor' | 'admin'
  ) => Promise<{ success: boolean; error?: string; needVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  switchRoleDemo: (newRole: 'patient' | 'doctor' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const DEMO_USER_KEY = '@demo_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  // Load profile from Supabase
  const fetchProfile = async (userId: string, userEmail: string, metaName?: string, metaRole?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const defaultRole = (userEmail.toLowerCase().includes('admin') || metaRole === 'admin') ? 'admin' : 'patient';

      if (data && !error) {
        setProfile({
          id: data.id,
          full_name: data.full_name || metaName || 'Nguyễn An',
          email: data.email || userEmail,
          phone: data.phone,
          avatar_url: data.avatar_url,
          role: (data.role as any) || defaultRole,
        });
      } else {
        setProfile({
          id: userId,
          full_name: metaName || 'Nguyễn An',
          email: userEmail,
          role: defaultRole,
        });
      }
    } catch {
      setProfile({
        id: userId,
        full_name: metaName || 'Nguyễn An',
        email: userEmail,
        role: userEmail.toLowerCase().includes('admin') ? 'admin' : 'patient',
      });
    }
  };

  useEffect(() => {
    if (isConfigured) {
      // Real Supabase session restore & listener
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(
            session.user.id,
            session.user.email ?? '',
            session.user.user_metadata?.full_name,
            session.user.user_metadata?.role
          );
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(
            session.user.id,
            session.user.email ?? '',
            session.user.user_metadata?.full_name,
            session.user.user_metadata?.role
          );
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Demo session restore from AsyncStorage
      AsyncStorage.getItem(DEMO_USER_KEY).then((stored) => {
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setProfile(parsed);
            setUser({ id: parsed.id, email: parsed.email } as User);
          } catch {}
        }
        setIsLoading(false);
      });
    }
  }, [isConfigured]);

  // 1. ĐĂNG KÝ
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: 'patient' | 'doctor' | 'admin' = 'patient'
  ) => {
    setIsLoading(true);
    try {
      if (!email.trim() || !password.trim()) {
        setIsLoading(false);
        return { success: false, error: 'Vui lòng nhập đầy đủ email và mật khẩu' };
      }
      if (password.length < 6) {
        setIsLoading(false);
        return { success: false, error: 'Mật khẩu phải có tối thiểu 6 ký tự' };
      }

      const assignedRole = email.toLowerCase().includes('admin') ? 'admin' : role;

      if (isConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim() || 'Nguyễn An',
              role: assignedRole,
            },
          },
        });

        setIsLoading(false);
        if (error) {
          return { success: false, error: error.message };
        }

        // If email confirmation is required:
        if (data.session === null && data.user) {
          return { success: true, needVerification: true };
        }

        return { success: true };
      } else {
        // Demo Mode Sign Up
        const mockProfile: UserProfile = {
          id: `demo-user-${Date.now()}`,
          full_name: fullName.trim() || 'Nguyễn An',
          email: email.trim(),
          role: assignedRole,
        };
        await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockProfile));
        setProfile(mockProfile);
        setUser({ id: mockProfile.id, email: mockProfile.email } as User);
        setIsLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Có lỗi xảy ra khi đăng ký' };
    }
  };

  // 2. ĐĂNG NHẬP
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!email.trim() || !password.trim()) {
        setIsLoading(false);
        return { success: false, error: 'Vui lòng nhập đầy đủ email và mật khẩu' };
      }

      if (isConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        setIsLoading(false);
        if (error) {
          return { success: false, error: error.message };
        }

        setSession(data.session);
        setUser(data.user);
        if (data.user) {
          fetchProfile(
            data.user.id,
            data.user.email ?? '',
            data.user.user_metadata?.full_name,
            data.user.user_metadata?.role
          );
        }
        return { success: true };
      } else {
        // Demo Mode Sign In
        const mockProfile: UserProfile = {
          id: 'demo-user-1',
          full_name: email.toLowerCase().includes('admin') ? 'Quản Trị Viên (Admin)' : 'Nguyễn An',
          email: email.trim(),
          role: email.toLowerCase().includes('admin') ? 'admin' : 'patient',
        };
        await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockProfile));
        setProfile(mockProfile);
        setUser({ id: mockProfile.id, email: mockProfile.email } as User);
        setIsLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Có lỗi xảy ra khi đăng nhập' };
    }
  };

  // 3. ĐĂNG XUẤT
  const signOut = async () => {
    setIsLoading(true);
    try {
      if (isConfigured) {
        await supabase.auth.signOut();
      } else {
        await AsyncStorage.removeItem(DEMO_USER_KEY);
      }
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. XÁC THỰC OTP
  const verifyOtp = async (email: string, token: string) => {
    setIsLoading(true);
    try {
      if (isConfigured) {
        const { error } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: token.trim(),
          type: 'signup',
        });
        setIsLoading(false);
        if (error) return { success: false, error: error.message };
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  // 5. QUÊN MẬT KHẨU
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      if (isConfigured) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
        setIsLoading(false);
        if (error) return { success: false, error: error.message };
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  // 6. CHUYỂN ĐỔI ROLE NHANH CHO DEMO / TESTING
  const switchRoleDemo = (newRole: 'patient' | 'doctor' | 'admin') => {
    const current = profile || {
      id: 'demo-user-1',
      full_name: 'Nguyễn An',
      email: 'an.nguyen@gmail.com',
    };
    const updated: UserProfile = {
      ...current,
      role: newRole,
      full_name: newRole === 'admin' ? 'Quản Trị Viên (Admin)' : 'Nguyễn An',
    };
    setProfile(updated);
    AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated));
  };

  const isAdmin = Boolean(
    profile?.role === 'admin' ||
    profile?.email?.toLowerCase().includes('admin') ||
    user?.email?.toLowerCase().includes('admin')
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        isLoading,
        isConfigured,
        signUp,
        signIn,
        signOut,
        verifyOtp,
        resetPassword,
        switchRoleDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
