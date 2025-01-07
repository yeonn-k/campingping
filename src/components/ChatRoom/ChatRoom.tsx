'use client';

import Button from '@/components/Button/Button';
import profileGreen from '@icons/profile_green.svg';

import Image from 'next/image';

interface ChatRoomProps {
  roomId: number;
}
const ChatRoom = ({ roomId }: ChatRoomProps) => {
  return (
    <div className="relative h-full">
      <div className="mt-6 ">
        <div className="px-6 pt-6 pb-2 flex gap-1 justify-between border-b border-Green">
          <div className="flex gap-1">
            <Image
              src={profileGreen}
              width={20}
              alt="프로필 아이콘"
              quality={10}
            />
            <div className="items-baseline ">
              <span className="text-bold mr-1">룰루</span>
              <span className="text-description text-Gray">님과의 대화</span>
            </div>
          </div>

          <button className="text-Green">대화 나가기</button>
        </div>

        <div>
          <div className="w-9/12 ml-3 mt-3 border border-LightGray p-3 rounded-2xl flex flex-wrap">
            <p className="w-full">룰루</p>
            <p className="w-full">안녕하세요!</p>
          </div>
          <p className="text-description text-Gray ml-6">
            2024. 12. 18 05:21 pm
          </p>
        </div>
        <div className="flex flex-wrap justify-end">
          <div className="w-9/12 mr-3 mt-3 bg-Green text-white p-3 rounded-2xl flex flex-wrap">
            <p className="w-full">나</p>
            <p className="w-full">안녕하세요!</p>
          </div>
          <p className="text-description text-Gray mr-6">
            2024. 12. 18 05:21 pm
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 border-t border-Green w-full h-40 flex justify-center items-center">
        <textarea
          placeholder="채팅을 입력하세요"
          className="w-64 h-36 outline-none	pt-2 pr-3"
        ></textarea>
        <Button height="h-24">전송</Button>
      </div>
    </div>
  );
};

export default ChatRoom;
