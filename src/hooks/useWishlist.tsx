import useWishlistStore from '@/stores/wishlistState';
import { api } from '@/utils/axios';
import { WishlistCamp } from '@/types/Camp';

interface UseWishlist {
  data: WishlistCamp[];
  getWishlist: () => void;
  addOrRemoveWishlist: ({
    contentId,
    status,
  }: {
    contentId: string;
    status: boolean;
  }) => Promise<void>;
}

const useWishlist = (): UseWishlist => {
  const { wishlist, setWishlist, addToWishlist, removeFromWishlist } =
    useWishlistStore();

  const getWishlist = async () => {
    try {
      const response = await api.get('/favorites');
      setWishlist(response.data.data);
    } catch (error) {
      console.error('Error fetching Wishlists:', error);
    }
  };

  const addOrRemoveWishlist = async ({
    contentId,
    status,
  }: {
    contentId: string;
    status: boolean;
  }) => {
    try {
      await api.post('/favorites', { contentId, status });
      if (status) {
        const camp = wishlist.find((camp) => camp.contentid === contentId);
        if (camp) addToWishlist(camp);
      } else {
        removeFromWishlist(contentId);
      }
    } catch (error) {
      console.error('Error posting Wishlists:', error);
    }
  };

  return {
    data: wishlist,
    getWishlist,
    addOrRemoveWishlist,
  };
};

export default useWishlist;
