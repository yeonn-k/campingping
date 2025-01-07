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
import { socket } from '@/socket';
import { chattingStore } from '@/stores/chattingState';
import { CreateChat } from '@/types/Chatting';

interface User {
  email: string;
  nickname: string;
}

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
  user: User;
  id: string;
  content: string;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const { setChatState, setChatRoomId } = chattingStore();

  useEffect(() => {
    if (!post) {
      console.error('Post or Post ID is undefined');
      setIsLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(post.id);
        setCurrentPost(fetchedPost.data);
        console.log(fetchedPost);
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
      const response = await getComments(communityId); // API 호출
      console.log('Fetched comments response:', response); // 반환값 디버깅
      const commentsData = response?.data?.comments; // comments 배열 추출
      if (!Array.isArray(commentsData)) {
        throw new Error(
          'getComments 함수가 올바른 배열을 반환하지 않았습니다.'
        );
      }
      setComments(commentsData); // 상태 업데이트
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]); // 오류 발생 시 빈 배열로 초기화
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const commentData = {
      content: newComment.trim(),
    };

    try {
      const newCommentData = await createComment(currentPost!.id, commentData);
      console.log('New comment created:', newCommentData);
      if (!newCommentData || typeof newCommentData !== 'object') {
        throw new Error(
          'createComment 함수가 올바른 데이터를 반환하지 않았습니다.'
        );
      }
      setComments((prevComments) => [...prevComments, newCommentData]); // 새 댓글 추가
      setNewComment('');
      await fetchComments(currentPost!.id); // 최신 댓글 다시 가져오기
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleCommentAction = async (
    action: 'update' | 'delete',
    commentId: string,
    updatedContent?: string
  ) => {
    if (!currentPost) {
      console.error('Current post is not defined');
      return;
    }

    const communityId = currentPost.id;

    try {
      let updatedComments = comments;

      if (action === 'update' && updatedContent) {
        // 댓글 수정 요청
        const response = await updateComment(communityId, commentId, {
          content: updatedContent,
        });
        console.log('Comment updated:', response);
        updatedComments = comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: updatedContent }
            : comment
        );
      } else if (action === 'delete') {
        // 댓글 삭제 요청
        await deleteComment(communityId, commentId);
        console.log(`Comment ${commentId} deleted.`);
        updatedComments = comments.filter(
          (comment) => comment.id !== commentId
        );
      }

      setComments(updatedComments); // 상태 업데이트
      setEditingCommentId(null); // 수정 상태 초기화
      setEditingContent(''); // 수정 내용 초기화
    } catch (error) {
      console.error(`Error ${action} comment:`, error);
    }
  };

  const handleEditClick = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditingContent(currentContent);
  };

  const handleEditSubmit = () => {
    if (!editingContent.trim()) return;
    handleCommentAction('update', editingCommentId!, editingContent.trim());
  };

  // chatting
  const createNewChat = (email: string) => {
    socket.emit('createRoom', {
      email: email,
    });
  };

  useEffect(() => {
    const handleRoomCreated = (data: CreateChat) => {
      const { roomId } = data;
      setChatState();
      setChatRoomId(roomId);
    };

    socket.on('roomCreated', handleRoomCreated);

    return () => {
      socket.off('roomCreated', handleRoomCreated);
    };
  }, []);

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
          <h3 className="text-subTitle text-center w-full  mr-4 mt-4">
            {post.title}
          </h3>
        </div>
        <hr className="my-2 border-t-1 border-LightGray w-full" />

        <div className="p-2">
          {/* 게시글 내용 */}
          {isLoading ? (
            <p>게시글을 불러오는 중입니다...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : currentPost ? (
            <>
              <p className="text-darkGray ml-4 mt-2">
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

          <div className="mt-4">
            <div>댓글</div>
            <hr className="my-2 border-t-1 border-LightGray w-full" />
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex justify-between items-center mb-2"
                  onClick={() => createNewChat(comment.user?.email)}
                >
                  <div className="flex items-center">
                    <p className="text-subTitle mr-2">
                      {comment.user?.nickname}
                      <p className="text-description">{comment.content}</p>
                    </p>
                  </div>
                  <div>
                    {editingCommentId === comment.id ? (
                      <>
                        <input
                          type="text"
                          className="border rounded p-1 "
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                        />
                        <button
                          className="ml-2 text-Green"
                          onClick={handleEditSubmit}
                        >
                          완료
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="mr-2 text-Green"
                          onClick={() =>
                            handleEditClick(comment.id, comment.content)
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
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">댓글이 없습니다!</div>
            )}
          </div>
          <textarea
            className="w-full border focus:border-Green rounded outline-none p-2 rounded mt-4"
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
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
