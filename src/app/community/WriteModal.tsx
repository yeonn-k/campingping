'use client';
import { createPost } from '@utils/communitiesService';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Image from 'next/image';
import closeIcon from '@icons/close.svg';

const WriteModal = ({
  onClose,
  onPostSubmit,
}: {
  onClose: () => void;
  onPostSubmit: VoidFunction;
}) => {
  const handleSubmit = async () => {
    const title = (document.querySelector('#title') as HTMLInputElement).value;
    const startDate = new Date(
      (document.querySelector('#startDate') as HTMLInputElement).value
    );
    const endDate = new Date(
      (document.querySelector('#endDate') as HTMLInputElement).value
    );
    const location = (document.querySelector('#location') as HTMLInputElement)
      .value;
    const people = parseInt(
      (document.querySelector('#people') as HTMLInputElement).value
    );
    const content = (document.querySelector('#content') as HTMLTextAreaElement)
      .value;

    if (title && startDate && endDate && location && people && content) {
      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const newPost = {
              title,
              startDate,
              endDate,
              location,
              people,
              content,
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            };

            await createPost(newPost);
            onPostSubmit();
            onClose();
          },
          (error) => {
            console.error('위치 정보를 가져오는 데 실패했습니다.', error);
          }
        );
      } catch (error) {
        console.error('게시글 작성 실패:', error);
      }
    }
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] h-[80%] max-w-md">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose}>
            <Image src={closeIcon} alt="닫기" width={10} height={10} />
          </button>
          <h2 className="text-subTitle text-center w-full">게시글 작성</h2>
        </div>
        <div className="mb-4 flex items-center space-x-2 ">
          <span className="w-16 text-left">제목</span>
          <Input id="title" placeholder={''} />
        </div>
        <div className="mb-4 flex items-center space-x-2 ">
          <span className="w-16 text-left">시작일</span>
          <Input type="datetime-local" id="startDate" placeholder={''} />
        </div>
        <div className="mb-4 flex items-center space-x-2 ">
          <span className="w-16 text-left">종료일</span>
          <Input type="datetime-local" id="endDate" placeholder={''} />
        </div>
        <div className="mb-4 flex items-center space-x-2">
          <span className="w-16 text-left">장소</span>
          <Input id="location" placeholder={''} />
        </div>
        <div className="mb-4 flex items-center space-x-2">
          <span className="w-16 text-left">인원</span>
          <Input id="people" placeholder={''} />
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
