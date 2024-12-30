'use client';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Image from 'next/image';
import closeIcon from '@icons/close.svg';

const WriteModal = ({
  onClose,
  onPostSubmit,
}: {
  onClose: () => void;
  onPostSubmit: (post: {
    title: string;
    date: string;
    state: string;
    people: string;
    content: string;
  }) => void;
}) => {
  const handleSubmit = () => {
    const title = (document.querySelector('#title') as HTMLInputElement).value;
    const date = (document.querySelector('#date') as HTMLTextAreaElement).value;
    const state = (document.querySelector('#location') as HTMLInputElement)
      .value;
    const people = (document.querySelector('#people') as HTMLTextAreaElement)
      .value;
    const content = (document.querySelector('#content') as HTMLInputElement)
      .value;

    if (title && date && state && people && content) {
      const newPost = { title, date, state, people, content };
      onPostSubmit(newPost);
      onClose(); // 작성 완료 후 모달 닫기
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto'; // 높이를 초기화
    textarea.style.height = `${textarea.scrollHeight}px`; // 입력 내용에 맞게 높이 조정
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] h-[80%] max-w-md">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose}>
            <Image src={closeIcon} alt="닫기" width={10} height={10} />
          </button>
          <h2 className="text-content  text-center w-full">게시글 작성</h2>
        </div>
        <div className="mb-4 flex items-center space-x-2 ">
          <span className="w-16 text-left">제목</span>
          <Input id="title" />
        </div>
        <div className="mb-4 flex items-center space-x-2 ">
          <span className="w-16 text-left">일정</span>
          <Input id="date" />
        </div>
        <div className="mb-4 flex items-center space-x-2">
          <span className="w-16 text-left">장소</span>
          <Input id="location" />
        </div>
        <div className="mb-4 flex items-center space-x-2">
          <span className="w-16 text-left">인원</span>
          <Input id="people" />
        </div>
        <div className="mb-4 flex items-center space-x-2 ">
          <span className="w-16 text-left mb-2">기타</span>
          <textarea
            id="content"
            onChange={handleContentChange}
            className="w-[65.5%]  border border-lightGray rounded resize-none overflow-hidden focus:border-Green focus:outline-none"
            style={{
              minHeight: '40px',
              lineHeight: '1.5',
              maxHeight: '200px',
            }}
          />
        </div>
        <div className="flex justify-center mt-6">
          <Button
            width="w-36"
            height="h-10"
            bgcolor="bg-Green"
            fontsize="content"
            onClick={handleSubmit}
          >
            등록
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WriteModal;
