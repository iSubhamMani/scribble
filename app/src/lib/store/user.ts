import { DefaultSession } from "next-auth";
import { create } from "zustand";

export type User = DefaultSession["user"] | null;

type UserStore = {
  user: User;
  setUser: (user: User) => void;
  removeUser: () => void;
};

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  removeUser: () => set({ user: null }),
}));
