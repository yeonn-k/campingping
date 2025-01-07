import { create } from 'zustand';

interface UserState {
  userState: boolean;
  setUserState: () => void;
}

export const userStore = create<UserState>((set) => ({
  userState: false,
  setUserState: () =>
    set((state) => ({
      userState: !state.userState,
    })),
}));
