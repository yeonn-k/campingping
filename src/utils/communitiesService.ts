import { api } from './axios';

export const createPost = async (
  postData: {
    id?: string;
    title: string;
    location: string;
    peopleNum: number;
    content: string;
    startDate: Date;
    endDate: Date;
    lat: number;
    lon: number;
  },
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setIsLoading(true);
    const formattedPostData = {
      ...postData,
    };
    const response = await api.post(`/communities`, formattedPostData, {});

    return response.data;
  } catch (error) {
    console.error('Error while creating a post:', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

export const getPosts = async (
  lat: number | null,
  lon: number | null,
  limit: number = 10,
  cursor?: number
) => {
  try {
    const response = await api.get(`/communities`, {
      params: { lon, lat, limit, cursor },
    });

    return response.data.data.result;
  } catch (error) {
    console.error('Error while fetching posts:', error);
    throw error;
  }
};

export const getMyPosts = async (limit: number = 10, cursor?: number) => {
  try {
    const response = await api.get(`/communities/myposts`, {
      params: { limit, cursor },
    });

    return response.data.data.result;
  } catch (error) {
    console.error('Error while fetching my posts:', error);
    throw error;
  }
};

export const getPostById = async (id: string) => {
  const response = await api.get(`/communities/${id}`, {});
  return response.data;
};

export const updatePost = async (
  id: string,
  postData: {
    id: string;
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
    const response = await api.patch(`/communities/${id}`, postData, {});
    return response.data;
  } catch (error) {
    console.error('Error while updating a post:', error);
    throw error;
  }
};

export const deletePost = async (id: string) => {
  try {
    const response = await api.delete(`/communities/${id}`, {});

    return response.data;
  } catch (error) {
    console.error('Error while deleting post:', error);
    throw error;
  }
};
