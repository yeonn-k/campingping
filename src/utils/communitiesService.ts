import axios from 'axios';

// Base URL 설정
const BASE_URL = 'https://kdt-react-node-1-team03.elicecoding.com/api';

// 게시글 작성
export const createPost = async (
  token: string,
  postData: {
    id?: string;
    title: string;
    location: string;
    people: number;
    content: string;
    startDate: Date;
    endDate: Date;
    lat: number;
    lon: number;
  }
) => {
  try {
    const formattedPostData = { ...postData };
    console.log('Create Post Data:', formattedPostData);

    const response = await axios.post(
      `${BASE_URL}/communities`,
      formattedPostData
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
    console.log(lat, lon);
    const response = await axios.get(`${BASE_URL}/communities`, {
      params: { lon, lat, limit, cursor },
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
    const response = await axios.get(`${BASE_URL}/communities/myposts`, {
      params: { limit, cursor },
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
    console.log('Update Post Data:', postData);

    const response = await axios.patch(
      `${BASE_URL}/communities/${id}`,
      postData
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
    const response = await axios.delete(`${BASE_URL}/communities/${id}`, {});

    console.log('Delete Post Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error while deleting post:', error);
    throw error;
  }
};
