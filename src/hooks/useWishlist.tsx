import useWishlistStore from '@/stores/wishlistState';
import { api } from '@/utils/axios';
import { Camp } from '@/types/Camp';

const useWishlist = () => {
  const { wishlist, setWishlist, addToWishlist, removeFromWishlist } =
    useWishlistStore();

  const getWishlist = async () => {
    try {
      const response = await api.get('/favorite');
      const fetchedWishlist: Camp[] = response.data;
      setWishlist(fetchedWishlist);
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
      await api.post('/favorite', { contentId, status });
      if (status) {
        const camp = wishlist.find((camp) => camp.contentId === contentId);
        if (camp) addToWishlist(camp);
      } else {
        removeFromWishlist(contentId);
      }
    } catch (error) {
      console.error('Error posting Wishlists:', error);
    }
  };

  return {
    wishlist,
    getWishlist,
    addOrRemoveWishlist,
  };
};

export default useWishlist;
