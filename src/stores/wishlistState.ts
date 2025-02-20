import { create } from 'zustand';
import { WishlistCamp } from '@/types/Camp';

interface WishlistState {
  wishlist: WishlistCamp[];
  setWishlist: (wishlist: WishlistCamp[]) => void;
  addToWishlist: (camp: WishlistCamp) => void;
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
      wishlist: state.wishlist.filter((camp) => camp.contentid !== contentId),
    })),
}));

export default useWishlistStore;
