import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RegionState {
  coloredRegion: string | null;
  coloredCity: string | null;
  setColoredRegion: (v: string | null) => void;
  setColoredCity: (v: string | null) => void;
}

export const regionStore = create<RegionState>()(
  persist(
    (set) => ({
      coloredRegion: null,
      coloredCity: null,
      setColoredRegion: (v: string | null) => {
        set({ coloredRegion: v });
      },
      setColoredCity: (v: string | null) => {
        set({ coloredCity: v });
      },
    }),
    {
      name: 'region-storage',
    }
  )
);
