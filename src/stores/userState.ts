import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userState: boolean;
  userEmail: string | null;
  setUserState: (v: string | null) => void;
}

export const userStore = create<UserState>()(
  persist(
    (set) => ({
      userState: false,
      userEmail: null,
      setUserState: (v: string | null) => {
        if (v === null) {
          set({ userState: false, userEmail: null });
          localStorage.removeItem('user-storage');
          window.location.reload();
        } else {
          set({ userState: true, userEmail: v });
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
