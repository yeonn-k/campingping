import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface userTokenState {
  token: string | null;
  setToken: (v: string | null | undefined) => void;
}

export const userTokenStore = create<userTokenState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (v: string | null | undefined) => {
        if (typeof v === 'string') {
          set({ token: v });
          localStorage.setItem('token', v);
        } else {
          set({ token: null });
          localStorage.removeItem('token');
        }
      },
    }),
    {
      name: 'token',
    }
  )
);
