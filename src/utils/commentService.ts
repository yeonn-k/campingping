import { api } from './axios';
import { CommentType } from '@/types/CommentType';

export const getComments = async (communitiesId: string) => {
  const response = await api.get(`/communities/${communitiesId}/comments`, {});
  return response.data;
};

export const createComment = async (
  communitiesId: string,
  commentData: CommentType
) => {
  const response = await api.post(
    `/communities/${communitiesId}/comments`,
    commentData
  );
  return response.data;
};

export const updateComment = async (
  communitiesId: string,
  commentId: string,
  commentData: CommentType
) => {
  const response = await api.patch(
    `/communities/${communitiesId}/comments/${commentId}`,
    commentData
  );
  return response.data;
};

export const deleteComment = async (
  communitiesId: string,
  commentId: string
) => {
  const response = await api.delete(
    `/communities/${communitiesId}/comments/${commentId}`
  );
  return response.data;
};
