import { create } from "zustand";
import type { IUser } from "@/types";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  initialized: boolean;
  setUser: (user: IUser | null) => void;
  setInitialized: (value: boolean) => void;
  isCustomer: () => boolean;
  isProvider: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  initialized: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setInitialized: (value) => set({ initialized: value }),
  isCustomer: () => get().user?.role === "CUSTOMER",
  isProvider: () => get().user?.role === "PROVIDER",
  isAdmin: () => get().user?.role === "ADMIN",
}));
