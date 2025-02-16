import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userState: boolean;
  userEmail: string | null;
  isVisited: boolean;
  setUserState: (v: string | null) => void;
  setIsVisited: (v: boolean) => void;
}

export const userStore = create<UserState>()(
  persist(
    (set) => ({
      userState: false,
      userEmail: null,
      isVisited: false,
      setUserState: (v: string | null) => {
        if (v === null) {
          set({ userState: false, userEmail: null });
          localStorage.removeItem('user-storage');
          localStorage.removeItem('token');
        } else {
          set({ userState: true, userEmail: v });
        }
      },
      setIsVisited: (v: boolean) => {
        set({ isVisited: v });
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
