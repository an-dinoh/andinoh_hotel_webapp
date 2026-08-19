"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { User } from "@/types/auth.types";
import { authService } from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (partialUser: Partial<User>) => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state lazily from storage
  useEffect(() => {
    try {
      const storedToken = authService.getToken();
      const storedUser = authService.getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (err) {
      console.error("Failed to restore auth state:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((newToken: string, newUser: User, refreshToken?: string) => {
    authService.saveAuth(newToken, newUser, refreshToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((partialUser: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partialUser };
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const refetchUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
      }
    } catch (err) {
      console.error("Failed to refetch user profile:", err);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout,
      updateUser,
      refetchUser,
    }),
    [user, token, isLoading, login, logout, updateUser, refetchUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
