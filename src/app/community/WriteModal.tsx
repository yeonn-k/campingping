'use client';
import { createPost } from '@utils/communitiesService';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Image from 'next/image';
import closeIcon from '@icons/close.svg';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface FormData {
  peopleNum: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
}

const WriteModal = ({
  onClose,
  onPostSubmit,
}: {
  onClose: () => void;
  onPostSubmit: VoidFunction;
}) => {
  const { register, handleSubmit } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    const content = (document.querySelector('#content') as HTMLTextAreaElement)
      .value;
    const { peopleNum, title, startDate, endDate, location } = data;
    const people = parseInt(peopleNum);
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('시작일은 종료일보다 이후일 수 없습니다.', {
        position: 'top-right',
        style: { zIndex: 9999 },
      });
      return;
    }
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

            await createPost(newPost, setIsLoading);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 flex items-center space-x-2 ">
            <span className="w-16 text-left">제목</span>
            <Input placeholder="제목을 입력해주세요" {...register('title')} />
          </div>
          <div className="mb-4 flex items-center space-x-2 ">
            <span className="w-16 text-left">시작일</span>
            <Input
              type="datetime-local"
              placeholder={''}
              {...register('startDate')}
            />
          </div>
          <div className="mb-4 flex items-center space-x-2 ">
            <span className="w-16 text-left">종료일</span>
            <Input
              type="datetime-local"
              placeholder={''}
              {...register('endDate')}
            />
          </div>
          <div className="mb-4 flex items-center space-x-2">
            <span className="w-16 text-left">장소</span>
            <Input
              placeholder="장소를 입력해주세요"
              {...register('location')}
            />
          </div>
          <div className="mb-4 flex items-center space-x-2">
            <span className="w-16 text-left">인원</span>
            <Input
              type="number"
              placeholder={'숫자만 입력해주세요'}
              {...register('peopleNum')}
            />
          </div>
          <div className="mb-4 flex items-center space-x-2 ">
            <span className="w-16 text-left mb-2">기타</span>
            <textarea
              id="content"
              onChange={handleContentChange}
              placeholder="기타 내용을 입력해주세요"
              className="w-[65.5%]  border border-lightGray rounded resize-none overflow-hidden focus:border-Green focus:outline-none placeholder:text-LightGray"
              style={{
                minHeight: '40px',
                lineHeight: '1.5',
                maxHeight: '200px',
              }}
            />
          </div>
          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              width="w-36"
              height="h-10"
              bgcolor="bg-Green"
              fontsize="content"
              isLoading={isLoading}
            >
              등록
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteModal;
