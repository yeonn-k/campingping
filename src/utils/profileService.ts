import { api } from './axios';

export const getProfile = async (token: string) => {
  try {
    const res = await api.get(`/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('프로필 이미지 조회 실패', error);
    throw error;
  }
};

export const updateProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await api.post(`/user/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    console.error('프로필 이미지 변경 실패', error);
    throw error;
  }
};
