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
  const [wishlist, setWishlist] = useState([
    {
      title: '변산반도국립공원 고사포 야영장',
      location: '강원 정선군 신동읍 동강로 916-212',
      description: '운해와 야경이 일품인 휴양림속 야영장',
      image: '/path-to-sample-image.jpg',
    },
    {
      title: '속초해수욕장 캠핑장',
      location: '강원 속초시 교동 285-1',
      description: '청정 해변과 자연 경관을 즐길 수 있는 캠핑장',
      image: '/path-to-sample-image-2.jpg',
    },
    {
      title: '태안해변 캠핑장',
      location: '충남 태안군 근흥면 신진리 1234',
      description: '백사장과 바다를 즐길 수 있는 캠핑지',
      image: '/path-to-sample-image-3.jpg',
    },
    {
      title: '강릉 경포대 캠핑장',
      location: '강원 강릉시 경포로 23',
      description: '경포대와 함께 바다를 볼 수 있는 캠핑장',
      image: '/path-to-sample-image-4.jpg',
    },
    {
      title: '청송 주왕산 캠핑장',
      location: '경북 청송군 주왕산면 3456',
      description: '산과 계곡이 어우러진 자연 속 캠핑장',
      image: '/path-to-sample-image-5.jpg',
    },
    {
      title: '청송 주왕산 캠핑장',
      location: '경북 청송군 주왕산면 3456',
      description: '산과 계곡이 어우러진 자연 속 캠핑장',
      image: '/path-to-sample-image-5.jpg',
    },
  ]); // 예시 위시리스트 데이터

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
        const token = localStorage.getItem('token'); // token 가져오기
        const res = await axios.post(
          'https://kdt-react-node-1-team03.elicecoding.com/api/user/profile',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
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
    <div className="min-h-screen bg-white">
      <div className="flex justify-center mt-4 gap-1">
        <Image src={logo1} alt="로고 이미지" width={100} height={100} />
      </div>

      {/* Profile Section */}
      <div className="bg-white p-6 mt-4 rounded-lg">
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
            <p className="font-bold text-lg">
              {response?.data?.user?.nickName}
            </p>
            <p className="text-gray-500">{response?.data?.user?.email}</p>
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
      </div>

      <hr className="my-2 border-t-1 border-lightGray" />

      {/* Wishlist Section */}
      <div className="bg-white p-1 rounded-lg h-full overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">위시리스트</h2>
        <div className="space-y-4">
          {wishlist.map((item, index) => (
            <div key={index} className="flex">
              <div className="relative w-40 h-28">
                <Image
                  src={item.image}
                  alt="캠핑장 이미지"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-l-lg"
                />
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-bold text-md">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.location}</p>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
              {/* Heart Icon */}
              <div className="flex items-center px-4">
                <button>
                  <Image
                    src="/path-to-heart-icon.svg"
                    alt="하트"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Nav />
    </div>
  );
};

export default MyPage;
