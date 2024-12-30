import { create } from 'zustand';

interface GlobalState {
  mapScriptLoaded: boolean;
  setMapScriptLoaded(value: boolean): void;
}

export const useGlobalStore = create<GlobalState>((set) => {
  return {
    mapScriptLoaded: false,
    setMapScriptLoaded: (value: boolean) => {
      set({ mapScriptLoaded: value });
    },
  };
});
