'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import closeIcon from '@icons/close.svg';
import profileIcon from '@images/profile.svg';
import { getPostById, updatePost } from '@utils/communitiesService';
import {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from '@utils/commentService';
import { socket } from '@/socket';
import { chattingStore } from '@/stores/chattingState';

interface User {
  email: string;
  nickname: string;
  profilUrl: string | null;
}

interface Post {
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
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedFields, setEditedFields] = useState<Partial<Post>>({});

  const { setChatRoomId, setChatState } = chattingStore();
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpandComment = (commentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

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
      const response = await getComments(communityId);
      const commentsData = response?.data?.comments || [];
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEditPost = () => {
    setIsEditingPost((prev) => !prev);
    if (!isEditingPost && currentPost) {
      const { title, content, location, people, startDate, endDate, lon, lat } =
        currentPost;
      setEditedFields({
        title,
        content,
        location,
        people,
        startDate,
        endDate,
        lon,
        lat,
      });
    }
  };

  const handleSavePost = async () => {
    if (!currentPost) return;

    try {
      const { ...updateData } = {
        title: editedFields.title ?? currentPost.title,
        content: editedFields.content ?? currentPost.content,
        location: editedFields.location ?? currentPost.location,
        people: editedFields.people ?? currentPost.people,
        startDate: editedFields.startDate ?? currentPost.startDate,
        endDate: editedFields.endDate ?? currentPost.endDate,
        lat: editedFields.lat ?? currentPost.lat,
        lon: editedFields.lon ?? currentPost.lon,
      };

      await updatePost(currentPost.id, updateData);

      setCurrentPost((prev) => {
        if (!prev) return null;
        return { ...prev, ...editedFields };
      });

      setIsEditingPost(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const commentData = { content: newComment.trim() };
    try {
      await createComment(currentPost!.id, commentData);
      await fetchComments(currentPost!.id);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleCommentAction = async (
    action: 'update' | 'delete',
    commentId: string,
    updatedContent?: string
  ) => {
    if (!currentPost) return;

    try {
      if (action === 'update' && updatedContent) {
        await updateComment(currentPost.id, commentId, {
          content: updatedContent,
        });
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? { ...comment, content: updatedContent }
              : comment
          )
        );
      } else if (action === 'delete') {
        await deleteComment(currentPost.id, commentId);
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
      }

      setEditingCommentId(null);
      setEditingContent('');
    } catch (error) {
      console.error('Error performing comment action:', error);
    }
  };

  const handleEditClick = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditingContent(currentContent);
  };

  // const handleEditSubmit = () => {
  //   if (!editingContent.trim()) return;
  //   handleCommentAction('update', editingCommentId!, editingContent.trim());
  // };

  // chatting
  const createNewChat = (email: string) => {
    socket.emit('createRoom', {
      email: email,
    });
  };

  useEffect(() => {
    const handleRoomCreated = (data: { roomId: number; message: string }) => {
      const { roomId } = data;
      setChatState(true);
      setChatRoomId(roomId);
    };

    socket.on('roomCreated', handleRoomCreated);

    return () => {
      socket.off('roomCreated', handleRoomCreated);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[19]">
      <div className="bg-white rounded-lg w-[90%] h-[80%] max-w-md overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose}>
            <Image
              src={closeIcon}
              alt="닫기"
              width={12}
              height={12}
              className="ml-4 mt-4"
            />
          </button>
          <h3 className="text-subTitle w-full text-center mt-4 mr-4">
            {post.title}
          </h3>
        </div>
        <hr className="my-2 border-LightGray" />

        <div className="p-2">
          {isLoading ? (
            <p>게시글을 불러오는 중입니다...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            currentPost && (
              <>
                {[
                  { field: 'title', label: '제목' },
                  { field: 'startDate', label: '시작일', type: 'date' },
                  { field: 'endDate', label: '종료일', type: 'date' },
                  { field: 'location', label: '장소' },
                  { field: 'people', label: '인원' },
                  { field: 'content', label: '기타' },
                ].map(({ field, label, type }) => (
                  <div key={field} className="mb-4">
                    <p className="text-darkGray">
                      {label}:{' '}
                      {isEditingPost ? (
                        <input
                          type={type || 'text'}
                          className="border rounded p-1"
                          value={
                            type === 'date'
                              ? new Date(
                                  editedFields[field as keyof Post] as string
                                )
                                  .toISOString()
                                  .slice(0, 10)
                              : editedFields[field as keyof Post]?.toString() ||
                                ''
                          }
                          onChange={(e) =>
                            handleFieldChange(
                              field,
                              type === 'date'
                                ? new Date(e.target.value).toISOString()
                                : e.target.value
                            )
                          }
                        />
                      ) : type === 'date' ? (
                        currentPost[field as keyof Post] ? (
                          new Date(
                            currentPost[field as keyof Post] as string
                          ).toLocaleDateString()
                        ) : (
                          '미정'
                        )
                      ) : (
                        currentPost[field as keyof Post]?.toString() || ''
                      )}
                    </p>
                  </div>
                ))}
              </>
            )
          )}
          <div className="text-right">
            {isEditingPost ? (
              <button
                className="bg-Green text-white p-2 rounded w-20"
                onClick={handleSavePost}
              >
                수정 완료
              </button>
            ) : (
              <button
                className="bg-Green text-white p-2 rounded w-20"
                onClick={toggleEditPost}
              >
                수정
              </button>
            )}
          </div>
          <div className="mt-4">
            <h4>댓글</h4>
            <hr className="my-2 border-LightGray" />
            {comments.map((comment) => {
              const isExpanded = expandedComments[comment.id];

              return (
                <div
                  key={comment.id}
                  className="flex justify-between items-center mb-2"
                >
                  <div className="w-[80%]">
                    <div>
                      <p
                        className="text-xl cursor-pointer flex items-center space-x-2 mb-2"
                        onClick={() => createNewChat(comment.user.email)}
                      >
                        <Image
                          src={comment.user.profilUrl || profileIcon}
                          alt="닫기"
                          width={20}
                          height={20}
                          className="mt-1 ml-2 mr-2"
                        />
                        {comment.user.nickname}
                      </p>
                    </div>

                    {editingCommentId === comment.id ? (
                      <>
                        <input
                          type="text"
                          className="border rounded p-1"
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                        />
                        <button
                          className="ml-2 text-Green"
                          onClick={() =>
                            handleCommentAction(
                              'update',
                              comment.id,
                              editingContent
                            )
                          }
                        >
                          완료
                        </button>
                      </>
                    ) : (
                      <>
                        <p
                          className={`whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-1 ml-2'}`}
                        >
                          {comment.content}
                        </p>
                        {comment.content.length > 20 && (
                          <button
                            className="ml-2 justify-end"
                            onClick={() => toggleExpandComment(comment.id)}
                          >
                            {isExpanded ? '접기' : '더보기'}
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  <div className="w-[20%]">
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
                      onClick={() => handleCommentAction('delete', comment.id)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <textarea
            className="w-full border rounded p-2 mt-4"
            placeholder="댓글을 입력하세요."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="text-right">
            <button
              className="bg-Green text-white p-2 rounded w-20"
              onClick={handleCommentSubmit}
            >
              댓글 등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
