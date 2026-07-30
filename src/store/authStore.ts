import { create } from "zustand";
import type { IUser } from "@/types";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  setUser: (user: IUser | null) => void;
  isCustomer: () => boolean;
  isProvider: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  isCustomer: () => get().user?.role === "CUSTOMER",
  isProvider: () => get().user?.role === "PROVIDER",
  isAdmin: () => get().user?.role === "ADMIN",
}));
