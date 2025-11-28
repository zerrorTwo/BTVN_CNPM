import { create } from "zustand";
import { User } from "../types";

interface AuthStore {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  isLoading: false,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    set({ token: null, user: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  initialize: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
      });
    }
  },
}));
