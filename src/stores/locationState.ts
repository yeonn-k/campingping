import { create } from 'zustand';

interface LocationState {
  lat: number | null;
  lon: number | null;
  setLocation: (lat: number, lon: number) => void;
  updateLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => {
  return {
    lat: null,
    lon: null,
    setLocation: (lat, lon) => set({ lat, lon }),
    updateLocation: () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          set({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        });
      }
    },
  };
});
