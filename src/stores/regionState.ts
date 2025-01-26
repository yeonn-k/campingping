import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RegionState {
  coloredState: string | null;
  setColoredState: (v: string | null) => void;
}

export const regionStore = create<RegionState>()(
  persist(
    (set) => ({
      coloredState: null,
      setColoredState: (v: string | null) => {
        if (v === null) {
          set(() => ({
            coloredState: null,
          }));
        } else {
          set(() => ({
            coloredState: v,
          }));
        }
      },
    }),
    {
      name: 'region-storage',
    }
  )
);
