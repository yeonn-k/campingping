/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Base URL 설정
const BASE_URL = 'https://kdt-react-node-1-team03.elicecoding.com/api';

// 게시글 작성
export const createPost = async (postData: {
  id?: string; // id는 선택적
  title: string;
  location: string;
  people: number; // 숫자로 수정
  content: string;
  startDate: Date;
  endDate: Date;
  lat: number;
  lon: number;
}) => {
  try {
    // 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('token'); // authToken이라는 키로 저장된 토큰 가져오기
    const formattedPostData = {
      ...postData,
    };

    // 헤더에 토큰 추가
    const response = await axios.post(
      `${BASE_URL}/communities`,
      formattedPostData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer 토큰 형식
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error while creating a post:', error);
    throw error;
  }
};

// 모든 게시글 조회
export const getPosts = async () => {
  const response = await axios.get(
    `${BASE_URL}/communities?lon=126.9292543&lat=37.6075865`
  );
  return response.data;
};

// 특정 게시글 조회
export const getPostById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/communities/${id}`);
  return response.data;
};

// 게시글 수정
export const updatePost = async (id: string, postData: any) => {
  const response = await axios.patch(`${BASE_URL}/communities/${id}`, postData);
  return response.data;
};

// 게시글 삭제
export const deletePost = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/communities/${id}`);
  return response.data;
};
