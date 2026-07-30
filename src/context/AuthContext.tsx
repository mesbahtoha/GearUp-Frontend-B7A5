"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { authService } from "@/services/auth.service";
import type {
  IUser,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

interface AuthContextType {
  user: IUser | null;
  loading: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  changePassword: (payload: {
    oldPassword: string;
    newPassword: string;
  }) => Promise<void>;
  updateProfile: (
    payload: Partial<{ name: string; phone: string }>
  ) => Promise<void>;

  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authService.getMyProfile();
      setUser(res.data);
    } catch {
      try {
        await authService.refreshToken();
        const res = await authService.getMyProfile();
        setUser(res.data);
      } catch {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true);
      try {
        await authService.login(payload);
        await refreshUser();
      } finally {
        setLoading(false);
      }
    },
    [refreshUser]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setLoading(true);
      try {
        await authService.register(payload);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(
    async (payload: { oldPassword: string; newPassword: string }) => {
      setLoading(true);
      try {
        await authService.changePassword(payload);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateProfile = useCallback(
    async (payload: Partial<{ name: string; phone: string }>) => {
      setLoading(true);
      try {
        await authService.updateProfile(payload);
        await refreshUser();
      } finally {
        setLoading(false);
      }
    },
    [refreshUser]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshUser,
      changePassword,
      updateProfile,
      setUser,
    }),
    [user, loading, login, register, logout, refreshUser, changePassword, updateProfile]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
