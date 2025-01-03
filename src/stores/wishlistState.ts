import { create } from 'zustand';
import { Camp } from '@/types/Camp';

interface WishlistState {
  wishlist: Camp[];
  setWishlist: (wishlist: Camp[]) => void;
  addToWishlist: (camp: Camp) => void;
  removeFromWishlist: (contentId: string) => void;
}

const useWishlistStore = create<WishlistState>((set) => ({
  wishlist: [],
  setWishlist: (wishlist) => set({ wishlist }),
  addToWishlist: (camp) =>
    set((state) => ({
      wishlist: [...state.wishlist, camp],
    })),
  removeFromWishlist: (contentId) =>
    set((state) => ({
      wishlist: state.wishlist.filter((camp) => camp.contentId !== contentId),
    })),
}));

export default useWishlistStore;
