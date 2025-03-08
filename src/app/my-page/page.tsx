'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import logo1 from '@images/campingping_orange.svg';
import profile from '@images/profile.svg';
import { getProfile, updateProfileImage } from '../../utils/profileService';
import useWishlistStore from '@/stores/wishlistState';
import { WishlistCamp } from '@/types/Camp';
import DefaultImg from '@/components/DefaultImg/DefaultImg';
import useWishlist from '@hooks/useWishlist';
import myWishIcon from '@icons/liked.svg';
import notMyWishIcon from '@icons/not-liked.svg';
import Card from '@/components/Card/Card';
import Header from '@/components/Header/Header';

interface UserProfile {
  user: {
    email: string;
    nickName: string;
    userType: string;
    image: {
      id: number;
      url: string;
    };
  };
}

const MyPage = () => {
  const [profileImage, setProfileImage] = useState<string>(profile);
  const [response, setResponse] = useState<UserProfile | null>(null);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { getWishlist, addOrRemoveWishlist } = useWishlist();

  useEffect(() => {
    getProfileImage();
    getWishlist();
  }, []);

  const getProfileImage = async () => {
    try {
      const data = await getProfile();
      setResponse(data.data);
      setProfileImage(data.data.user.image.url || profile);
    } catch (error) {
      console.error('프로필 이미지 조회 실패', error);
    }
  };

  const handleToggleWishlist = async (
    camp: WishlistCamp,
    e: React.MouseEvent<HTMLImageElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const isLiked = wishlist.some((item) => item.contentid === camp.contentid);

    try {
      await addOrRemoveWishlist({
        contentId: camp.contentid,
        status: !isLiked,
      });

      if (isLiked) {
        removeFromWishlist(camp.contentid);
      } else {
        addToWishlist(camp);
      }
    } catch (error) {
      console.error('위시리스트 업데이트 실패', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex justify-center mt-4 gap-1">
        <Header />
      </div>

      <main className="flex-grow bg-white p-6 mt-4 rounded-full pt-11 sm:pt-14">
        <div className="flex flex-wrap items-center border border-Green rounded-3xl p-8">
          <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center">
            <Image
              src={profileImage || profile}
              alt="프로필 이미지"
              fill
              sizes="auto"
              className="rounded-full"
            />
          </div>
          <div className="ml-4">
            <p className="font-bold text-lg">{response?.user.nickName}</p>
            <p className="text-gray-500">{response?.user.email}</p>
          </div>

          <div className="mt-4 w-full flex justify-center">
            <label
              htmlFor="profile-upload"
              className="cursor-pointer text-textGreen text-center"
            >
              프로필 사진 변경
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (event) => {
                if (event.target.files) {
                  const file = event.target.files[0];
                  setProfileImage(URL.createObjectURL(file));

                  try {
                    const data = await updateProfileImage(file);
                    setProfileImage(data.data.user.image.url);
                    getProfileImage();
                  } catch (error) {
                    console.error('프로필 이미지 변경 실패', error);
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="mt-6 mb-10">
          <h2 className="text-lg font-bold mb-4">위시리스트</h2>

          {wishlist.length > 0 ? (
            <ul className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 pb-20 overflow-auto h-screen pb-96">
              {wishlist.map((camp: WishlistCamp) => (
                <Card
                  //  ref={idx === campingData.length - 1 ? loadMoreRef : undefined}
                  key={camp.contentid}
                  contentId={camp.contentid}
                  liked={true}
                  imgSrc={camp.firstimageurl}
                  name={camp.facltnm ? camp.facltnm : ''}
                  address={
                    camp.addr1
                      ? camp.addr2
                        ? `${camp.addr1} ${camp.addr2}`
                        : camp.addr1
                      : ''
                  }
                  description={camp.lineintro || ''}
                />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">위시리스트가 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyPage;
