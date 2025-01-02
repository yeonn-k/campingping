/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import closeIcon from '@icons/close.svg';
import { getPosts, createPost, getPostById } from '@utils/communitiesService';

interface Post {
  id: string;
  title: string;
  location: string;
  people: number;
  content: string;
  startDate: Date | null;
  endDate: Date | null;
  lat: number;
  lon: number;
  user: {
    email: string;
    nickname: string;
  };
}

interface PostDetailModalProps {
  post: Post; // 정확히 Post 타입을 지정해야 함
  onClose: () => void;
}

interface Comment {
  author: string;
  content: string;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await getPostById(post.id);
        setMyPosts(posts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [post]);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const commentData: Comment = {
      author: 'User', // 실제 사용자 정보로 변경
      content: newComment.trim(),
    };

    setComments((prev) => [...prev, commentData]);
    setNewComment('');
  };

  const handleNewPostSubmit = async (newPost: Omit<Post, 'id'>) => {
    try {
      const createdPost = await createPost(newPost);
      setMyPosts((prevPosts) => [...prevPosts, createdPost]);
    } catch (error) {
      console.error('Error creating post:', error);
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
            {post.title}
          </h3>
        </div>

        <hr className="my-2 border-t-1 border-LightGray w-full" />

        <div className="mb-2">
          <p className="text-darkGray ml-4 mt-4">
            시작일:{' '}
            {post.startDate
              ? new Date(post.startDate).toLocaleDateString()
              : '미정'}
          </p>
          <p className="text-darkGray ml-4 mt-4">
            종료일:{' '}
            {post.endDate
              ? new Date(post.endDate).toLocaleDateString()
              : '미정'}
          </p>
          <p className="text-darkGray ml-4 mt-4">장소: {post.location}</p>
          <p className="text-darkGray ml-4 mt-4">인원: {post.people}</p>
          <p className="ml-4 mt-4">{post.content}</p>
        </div>

        <div className="p-4">
          <div className="mb-4">
            {isLoading ? (
              <p>게시글을 불러오는 중입니다...</p>
            ) : myPosts.length > 0 ? (
              myPosts.map((post) => (
                <div key={post.id} className="border-b py-2">
                  <strong>{post.title}</strong>: {post.content}
                </div>
              ))
            ) : (
              <p>게시글이 없습니다.</p>
            )}
          </div>

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

          {/* 새로운 게시글 추가 */}
          <button
            className="mt-4 bg-Blue text-white p-2 w-32 rounded"
            onClick={() =>
              handleNewPostSubmit({
                title: '새 게시글 제목',
                location: '새 위치',
                people: 1,
                content: '새 게시글 내용',
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
                lat: 0,
                lon: 0,
                user: { email: 'a98312421@gmail.com', nickname: 'aa' },
              })
            }
          >
            새 게시글 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
