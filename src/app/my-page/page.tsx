'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import logo1 from '@images/campingping_orange.svg';
import profile from '@images/profile.svg';
import { getProfile, updateProfileImage } from '../../utils/profileService';

interface UserProfile {
  data: {
    user: {
      email: string;
      nickName: string;
      userType: string;
      image: {
        id: number;
        url: string;
      };
    };
  };
}

const MyPage = () => {
  const [profileImage, setProfileImage] = useState<string>(profile);
  const [response, setResponse] = useState<UserProfile | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      getProfileImage(token);
    }
  }, []);

  const getProfileImage = async (token: string) => {
    try {
      const data = await getProfile(token);
      setResponse(data);
      setProfileImage(data.data.user.image.url || profile);
    } catch (error) {
      console.error('프로필 이미지 조회 실패', error);
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setProfileImage(URL.createObjectURL(file));

      try {
        const data = await updateProfileImage(file);
        if (token) {
          setProfileImage(data.data.user.image.url);
          getProfileImage(token);
        }
      } catch (error) {
        console.error('프로필 이미지 변경 실패', error);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex justify-center mt-4 gap-1">
        <Image src={logo1} alt="로고 이미지" width={100} height={100} />
      </div>

      <main className="flex-grow bg-white p-6 mt-4 rounded-lg">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
            <Image
              src={profileImage || profile}
              alt="프로필 이미지"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <div className="ml-4">
            <p className="font-bold text-lg">{response?.data.user.nickName}</p>
            <p className="text-gray-500">{response?.data.user.email}</p>
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="profile-upload"
            className="cursor-pointer text-blue-500"
          >
            프로필 사진 변경
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </main>
    </div>
  );
};

export default MyPage;
