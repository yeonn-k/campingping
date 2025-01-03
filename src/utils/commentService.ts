/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './axios';

// 특정 게시글의 모든 댓글 조회
export const getComments = async (communitiesId: string) => {
  const response = await api.get(`/communities/${communitiesId}/comments`);
  return response.data;
};

// 새로운 댓글 작성
export const createComment = async (
  communitiesId: string,
  commentData: any
) => {
  const token = localStorage.getItem('token');

  const response = await api.post(
    `/communities/${communitiesId}/comments`,
    commentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// 특정 댓글 수정
export const updateComment = async (
  communitiesId: string,
  commentId: string,
  commentData: any
) => {
  const token = localStorage.getItem('token');
  const response = await api.patch(
    `/communities/${communitiesId}/comments/${commentId}`,
    commentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// 특정 댓글 삭제
export const deleteComment = async (
  communitiesId: string,
  commentId: string
) => {
  const token = localStorage.getItem('token');
  const response = await api.delete(
    `/communities/${communitiesId}/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
