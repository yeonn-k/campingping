'use client';

import React, { useEffect } from 'react';
import ProfileHeader from '../../components/Profile/profileHeader';
import Wishlist from '../../components/Wishlist/WishlistItem';
import { useWishlistStore } from '../../stores/wishlistStore';
import { api } from '@/utils/axios';
const MyPage: React.FC = () => {
  const { wishlist, setWishlist } = useWishlistStore();

  useEffect(() => {
    // 위시리스트 데이터를 서버에서 가져오기
    const fetchWishlist = async () => {
      try {
        const response = await api.get('/favorites');
        setWishlist(response.data);
      } catch (error) {
        console.error('위시리스트를 불러오는 중 오류 발생:', error);
      }
    };
    fetchWishlist();
  }, [setWishlist]);

  return (
    <div className="p-4">
      <ProfileHeader />
      <h2 className="mt-8 text-xl font-bold">위시리스트</h2>
      <Wishlist items={wishlist} />
    </div>
  );
};

export default MyPage;
