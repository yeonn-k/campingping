import { create } from 'zustand';
import { Camp } from '@/assets/types/Camp';

interface WishlistState {
  wishlist: Camp[];
  setWishlist: (wishlist: Camp[]) => void;
}

const useWishlistStore = create<WishlistState>((set) => ({
  wishlist: [],
  setWishlist: (wishlist: Camp[]) => set({ wishlist }),
}));

export default useWishlistStore;
