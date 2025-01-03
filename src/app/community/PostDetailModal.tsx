'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import closeIcon from '@icons/close.svg';
import { getPostById } from '@utils/communitiesService';
import {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from '@utils/commentService';

interface Post {
  data: any;
  id: string;
  title: string;
  location: string;
  people: number;
  content: string;
  startDate: Date | null;
  endDate: Date | null;
  lat: number;
  lon: number;
}

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
}

interface Comment {
  id: number; // 숫자형 고유 ID
  content: string;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!post || !post.data || !post.data.id) {
      console.error('Post or Post ID is undefined');
      setIsLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(post.data.id);
        setCurrentPost(fetchedPost.data);
      } catch (error) {
        console.error('Error loading post:', error);
        setError('게시글을 불러오는 중 문제가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [post]);

  useEffect(() => {
    if (currentPost) {
      fetchComments(currentPost.id);
    }
  }, [currentPost]);

  const fetchComments = async (communityId: string) => {
    try {
      const commentsData = await getComments(communityId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentAction = async (
    action: 'update' | 'delete',
    commentId: number,
    updatedContent?: string
  ) => {
    try {
      let updatedComments = comments;
      if (action === 'update' && updatedContent) {
        const updatedComment = await updateComment(currentPost!.id, commentId, {
          content: updatedContent,
        });
        updatedComments = comments.map((comment) =>
          comment.id === commentId ? updatedComment : comment
        );
      } else if (action === 'delete') {
        await deleteComment(currentPost!.id, commentId);
        updatedComments = comments.filter(
          (comment) => comment.id !== commentId
        );
      }
      setComments(updatedComments);
    } catch (error) {
      console.error(`Error ${action} comment:`, error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const commentData: Comment = {
      content: newComment.trim(),
    };

    try {
      const newCommentData = await createComment(currentPost!.id, commentData);
      setComments([...comments, newCommentData]);
      setNewComment('');
      fetchComments(currentPost!.id); // 댓글 생성 후 다시 댓글을 가져오기
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[90%] h-[80%] max-w-md overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose}>
            <Image
              src={closeIcon}
              alt="닫기"
              width={10}
              height={10}
              className="ml-4 mt-4"
            />
          </button>
          <h3 className="text-subTitle text-center w-full mr-4 mt-4">
            {post.data.title}
          </h3>
        </div>

        <hr className="my-2 border-t-1 border-LightGray w-full" />

        <div className="mb-2">
          {isLoading ? (
            <p>게시글을 불러오는 중입니다...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : currentPost ? (
            <>
              <p className="text-darkGray ml-4 mt-4">
                시작일:{' '}
                {currentPost.startDate
                  ? new Date(currentPost.startDate).toLocaleDateString()
                  : '미정'}
              </p>
              <p className="text-darkGray ml-4 mt-4">
                종료일:{' '}
                {currentPost.endDate
                  ? new Date(currentPost.endDate).toLocaleDateString()
                  : '미정'}
              </p>
              <p className="text-darkGray ml-4 mt-4">
                장소: {currentPost.location}
              </p>
              <p className="text-darkGray ml-4 mt-4">
                인원: {currentPost.people}
              </p>
              <p className="ml-4 mt-4">{currentPost.content}</p>
            </>
          ) : (
            <p>게시글이 없습니다.</p>
          )}
        </div>

        <div className="p-4">
          {/* 댓글 */}
          <textarea
            className="w-full border p-2 rounded"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요."
          />
          <div className="flex justify-end">
            <button
              className="mt-2 bg-Green text-white p-2 w-20 rounded"
              onClick={handleCommentSubmit}
            >
              등록
            </button>
          </div>
          <div className="mt-4">
            {comments.length > 0
              ? comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex justify-between items-center mb-2"
                  >
                    <p>{comment.content}</p>
                    <div>
                      <button
                        className="mr-2 text-blue-500"
                        onClick={() =>
                          handleCommentAction(
                            'update',
                            comment.id,
                            prompt('수정:', comment.content) || comment.content
                          )
                        }
                      >
                        수정
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() =>
                          handleCommentAction('delete', comment.id)
                        }
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
