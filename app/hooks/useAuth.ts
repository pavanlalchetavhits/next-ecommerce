'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export interface AuthUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: 'user' | 'admin' | string;
  status?: string;
}

export function useAuth() {
  const { data: session, status, update } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!session?.user;
  const user = (session?.user as AuthUser) || null;

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  const login = (provider?: string, options?: Parameters<typeof signIn>[1]) => {
    return signIn(provider, options);
  };

  const logout = (options?: Parameters<typeof signOut>[0]) => {
    return signOut(options);
  };

  return {
    user,
    session,
    status,
    isLoading,
    isAuthenticated,
    isAdmin,
    isUser,
    login,
    logout,
    updateSession: update,
  };
}
