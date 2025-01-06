import axios from 'axios';

// Base URL 설정
const BASE_URL = 'https://kdt-react-node-1-team03.elicecoding.com/api';

// 게시글 작성
export const createPost = async (postData: {
  id?: string;
  title: string;
  location: string;
  people: number;
  content: string;
  startDate: Date;
  endDate: Date;
  lat: number;
  lon: number;
}) => {
  try {
    const token = localStorage.getItem('token'); // authToken 가져오기
    const formattedPostData = {
      ...postData,
    };

    console.log('Create Post Data:', formattedPostData);

    const response = await axios.post(
      `${BASE_URL}/communities`,
      formattedPostData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer 토큰 형식
        },
      }
    );

    console.log('Create Post Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error while creating a post:', error);
    throw error;
  }
};

export const getPosts = async (
  lat: number,
  lon: number,
  limit: number = 10,
  cursor?: number
) => {
  try {
    const token = localStorage.getItem('token'); // 토큰 가져오기

    if (!token) throw new Error('토큰이 없습니다.');
    console.log(lat, lon);
    const response = await axios.get(`${BASE_URL}/communities`, {
      headers: {
        Authorization: `Bearer ${token}`, // Bearer 토큰 형식
      },
      params: {
        lon: lon,
        lat: lat,
        limit: limit,
        cursor: cursor,
      },
    });

    console.log('Get Posts Response:', response.data);

    return response.data.result;
  } catch (error) {
    console.error('Error while fetching posts:', error);
    throw error;
  }
};
export const getMyPosts = async (limit: number = 10, cursor?: number) => {
  try {
    const token = localStorage.getItem('token'); // 토큰 가져오기

    if (!token) throw new Error('토큰이 없습니다.');

    const response = await axios.get(`${BASE_URL}/communities/myposts`, {
      headers: {
        Authorization: `Bearer ${token}`, // Bearer 토큰 형식
      },
      params: {
        limit: limit,
        cursor: cursor,
      },
    });

    console.log('Get My Posts Response:', response.data);

    return response.data.data.result;
  } catch (error) {
    console.error('Error while fetching my posts:', error);
    throw error;
  }
};

// 특정 게시글 조회
export const getPostById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/communities/${id}`);
  console.log('Get Post Response:', response.data);
  return response.data;
};

// 게시글 수정
export const updatePost = async (id: string, postData: any) => {
  try {
    const token = localStorage.getItem('token'); // authToken 가져오기
    const userId = localStorage.getItem('userId'); // 작성자 정보 가져오기 (수정 필요 시)

    // 게시글 조회 및 작성자 확인
    const postResponse = await axios.get(`${BASE_URL}/communities/${id}`);
    const post = postResponse.data;

    console.log('Update Post Data:', postData);

    if (post.userId !== userId) {
      throw new Error('권한이 없습니다.');
    }

    const response = await axios.patch(
      `${BASE_URL}/communities/${id}`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer 토큰 형식
        },
      }
    );

    console.log('Update Post Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error while updating a post:', error);
    throw error;
  }
};

// 게시글 삭제
export const deletePost = async (id: string) => {
  try {
    const token = localStorage.getItem('token'); // authToken 가져오기
    const userId = localStorage.getItem('userId'); // 작성자 정보 가져오기 (수정 필요 시)

    // 게시글 조회 및 작성자 확인
    const postResponse = await axios.get(`${BASE_URL}/communities/${id}`);
    const post = postResponse.data;

    if (post.userId !== userId) {
      throw new Error('권한이 없습니다.');
    }

    const response = await axios.delete(`${BASE_URL}/communities/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Bearer 토큰 형식
      },
    });

    console.log('Delete Post Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error while deleting post:', error);
    throw error;
  }
};
