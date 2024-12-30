'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import closeIcon from '@icons/close.svg';

interface PostDetailModalProps {
  post: {
    id: string;
    title: string;
    date: string;
    state: string;
    people: string;
    content: string;
  };
  onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const [comments, setComments] = useState<
    { author: string; content: string }[]
  >([]);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = () => {
    if (newComment.trim() === '') return;

    const commentData = {
      author: 'User', // 실제 사용자 정보로 대체
      content: newComment,
    };

    setComments([...comments, commentData]);
    setNewComment('');
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
          <p className="text-darkGray ml-4 mt-4">일정: {post.date}</p>
          <p className="text-darkGray ml-4 mt-4">장소: {post.state}</p>
          <p className="text-darkGray ml-4 mt-4">인원: {post.people}</p>
          <p className="ml-4 mt-4">{post.content}</p>
        </div>

        <div className="p-4">
          <div className="mb-4">
            {comments.map((comment, index) => (
              <div key={index} className="border-b py-2">
                <strong>{comment.author}</strong>: {comment.content}
              </div>
            ))}
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
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
