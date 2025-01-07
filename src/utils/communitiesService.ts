import { api } from './axios';

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
    const token = localStorage.getItem('token');
    const response = await api.post('/communities', postData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Create Post Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error while creating a post:', error);
    throw error;
  }
};

// 게시글 목록 조회
export const getPosts = async (
  lat: number,
  lon: number,
  limit: number = 10,
  cursor?: number
) => {
  try {
    const response = await api.get('/communities', {
      params: { lat, lon, limit, cursor },
    });
    console.log('Get Posts Response:', response.data);
    return response.data.data.result;
  } catch (error) {
    console.error('Error while fetching posts:', error);
    throw error;
  }
};

// 내 게시글 조회
export const getMyPosts = async (limit: number = 10, cursor?: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/communities/myposts', {
      params: { limit, cursor },
      headers: {
        Authorization: `Bearer ${token}`,
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
  try {
    const response = await api.get(`/communities/${id}`);
    console.log('Get Post Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error while fetching a post:', error);
    throw error;
  }
};

// 게시글 수정
export const updatePost = async (
  id: string,
  postData: {
    title?: string;
    location?: string;
    people?: number;
    content?: string;
    startDate?: Date;
    endDate?: Date;
    lat?: number;
    lon?: number;
  }
) => {
  try {
    const response = await api.patch(`/communities/${id}`, postData);
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
    const response = await api.delete(`/communities/${id}`);
    console.log('Delete Post Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error while deleting post:', error);
    throw error;
  }
};
