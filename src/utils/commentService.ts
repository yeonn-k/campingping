/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './axios';

// 특정 게시글의 모든 댓글 조회
export const getComments = async (communityId: string) => {
  const response = await api.get(`/communities/${communityId}/comments`);
  return response.data;
};

// 새로운 댓글 작성
export const createComment = async (communityId: string, commentData: any) => {
  const response = await api.post(
    `/communities/${communityId}/comments`,
    commentData
  );
  return response.data;
};

// 특정 댓글 수정
export const updateComment = async (
  communityId: string,
  commentId: string,
  commentData: any
) => {
  const response = await api.patch(
    `/communities/${communityId}/comments/${commentId}`,
    commentData
  );
  return response.data;
};

// 특정 댓글 삭제
export const deleteComment = async (communityId: string, commentId: string) => {
  const response = await api.delete(
    `/communities/${communityId}/comments/${commentId}`
  );
  return response.data;
};
