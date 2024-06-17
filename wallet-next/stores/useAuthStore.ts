import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AuthStore = {
  user: Record<string, any> | null;
  setUser: (user: Record<string, any>) => void;
  token: string | null;
  setToken: (token: string) => void;
};

const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set((state) => ({ user: user })),
    token: null,
    setToken: (token) => set((state) => ({ token: token })),
  }))
);

export default useAuthStore;
