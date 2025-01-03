import { Camp } from '@/assets/types/Camp';
import useWishlistStore from '@/stores/wishlistState';
import axios from 'axios';

const useWishlist = () => {
  const { wishlist, setWishlist } = useWishlistStore();

  const fetchWishlist = async () => {
    try {
      const fetchData = await axios.get('/favorite');
      const wishlist: Camp[] = fetchData.data;
      setWishlist(wishlist);
    } catch (error) {
      console.error('Error fetching Wishlists:', error);
    }
  };

  const postWishlist = async (camp: Camp) => {
    try {
      const fetchData = await axios.post('/favorite');

      const wishlist: Camp[] = fetchData.data;
      setWishlist(wishlist);
    } catch (error) {
      console.error('Error fetching Wishlists:', error);
    }
  };

  //   const deleteFavorite = (contentId: string) => {
  //     try {
  //       const fetchData = await axios.get('/favorite');
  //       const wishlist: Camp[] = fetchData.data;
  //       setWishlist(wishlist);
  //     } catch (error) {
  //       console.error('Error fetching Wishlists:', error);
  //     }
  //   };

  return {
    wishlist,
    fetchWishlist,
    postWishlist,
    // deleteFavorite,
  };
};

export default useWishlist;
