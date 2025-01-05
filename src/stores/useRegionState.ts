import { create } from 'zustand';

interface RegionState {
  regionState: string | null;
  coloredState: string;
  setRegionState: (v: React.MouseEvent<HTMLDivElement> | string | null) => void;
}

export const regionStore = create<RegionState>((set, get) => ({
  regionState: null,
  coloredState: '',
  setRegionState: (v: React.MouseEvent<HTMLDivElement> | string | null) => {
    if (v === null) {
      set(() => ({
        regionState: null,
        coloredState: '',
      }));
    }
    if (typeof v === 'string') {
      set(() => ({
        regionState: v,
      }));
    } else if (
      v !== null &&
      typeof v !== 'string' &&
      v.target instanceof HTMLDivElement
    ) {
      const value = v.target.innerText;

      const { coloredState } = get();

      if (value === coloredState) {
        set(() => ({
          regionState: null,
          coloredState: '',
        }));
      } else {
        let formattedRegion = value;

        if (value.includes('특별자치')) {
          formattedRegion = value.slice(0, 2) + value.slice(-1);
        } else if (value.includes('광역시') || value.includes('특별시')) {
          formattedRegion = value.slice(0, 2) + '시';
        }

        set(() => ({
          regionState: formattedRegion,
          coloredState: value,
        }));
      }
    }
  },
}));
