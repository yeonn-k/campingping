import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userState: boolean;
  userEmail: string | null;
  setUserState: (v: string | null) => void;
}

export const userStore = create(
  persist(
    (set) => ({
      userState: false,
      userEmail: null,
      setUserState: (v: string | null) =>
        set((state: UserState) => ({
          userState: !state.userState,
          userEmail: v,
        })),
    }),
    {
      name: 'user-storage',
    }
  )
);
