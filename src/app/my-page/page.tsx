'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import logo1 from '@images/campingping_orange.svg';
import profile from '@images/profile.svg';
import Nav from '@/components/Nav/Nav';
import axios from 'axios';

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
  const [profileImage, setProfileImage] = useState<string>(profile); // 기본 프로필 이미지 설정
  const [response, setResponse] = useState<UserProfile | null>(null); // API 응답 저장 변수 선언
  console.log(response);
  console.log(response?.data.user.email);

  useEffect(() => {
    const token = localStorage.getItem('token'); // localStorage에서 token 가져오기
    if (token) {
      getProfileImage(token); // token 존재 시 프로필 이미지 조회 호출
    }
  }, []);

  const getProfileImage = async (token: string) => {
    try {
      const res = await axios.get(
        'https://kdt-react-node-1-team03.elicecoding.com/api/user/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse(res.data); // 응답 데이터를 상태에 저장
      setProfileImage(res.data.data.user.image.url || profile); // 기본 프로필 이미지로 fallback 설정
    } catch (error) {
      console.error('프로필 이미지 조회 실패', error);
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // 선택한 이미지 미리보기 설정

      // API 요청 로직
      const formData = new FormData();
      formData.append('file', file); // 요청 본문 변경

      try {
        const res = await axios.post(
          'https://kdt-react-node-1-team03.elicecoding.com/api/user/profile',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (res.status === 201) {
          const newImageUrl = res.data.data.user.image.url;
          setProfileImage(newImageUrl);
          console.log('프로필 이미지 변경 성공', newImageUrl);
          getProfileImage(token); // 변경된 이미지를 다시 가져옴
        }
      } catch (error) {
        console.error('프로필 이미지 변경 실패', error);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Section */}
      <div className="flex justify-center mt-4 gap-1">
        <Image src={logo1} alt="로고 이미지" width={100} height={100} />
      </div>

      {/* Profile Section */}
      <main className="flex-grow bg-white p-6 mt-4 rounded-lg">
        <div className="flex items-center">
          {/* Profile Image */}
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
            <Image
              src={profileImage || profile}
              alt="프로필 이미지"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          {/* User Info */}
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

      {/* Navigation Section */}
      <Nav className="mt-auto" />
    </div>
  );
};

export default MyPage;
