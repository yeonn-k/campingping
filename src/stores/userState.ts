import { create } from 'zustand';

interface UserState {
  userState: boolean;
  userEmail: string | null;
  setUserState: (v: string | null) => void;
}

export const userStore = create<UserState>((set) => ({
  userState: false,
  userEmail: null,
  setUserState: (v) =>
    set((state) => ({
      userState: !state.userState,
      userEmail: v,
    })),
}));
