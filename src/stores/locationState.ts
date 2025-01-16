import { create } from 'zustand';

interface LocationState {
  userLat: number | null;
  userLon: number | null;
  setLocation: (lat: number, lon: number) => void;
  updateLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => {
  return {
    userLat: null,
    userLon: null,
    setLocation: (userLat, userLon) => set({ userLat, userLon }),
    updateLocation: () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          set({
            userLat: position.coords.latitude,
            userLon: position.coords.longitude,
          });
        });
      }
    },
  };
});
