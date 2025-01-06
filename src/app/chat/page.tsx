'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';

import chevron from '@icons/chevron_gray.svg';
import ChatRoom from './component/ChatRoom';

import goToBack from '@icons/goToBack.svg';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<number | null>(1);

  const handleGoBack = () => {
    setChatRoomId(null);
  };

  const handleClose = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div
      className={`bg-white absolute bottom-0 w-full ${isOpen ? 'h-92%' : 'h-0'} rounded-t-2xl overflow-hidden flex flex-col  shadow-mapListShadow z-zMapModal transition-all duration-500 ease-in-out`}
    >
      <div className="relative flex justify-center ">
        <Image
          src={chevron}
          alt="화살표 아이콘"
          width={16}
          quality={10}
          className="pb-2 mb-4 mt-3 origin-center rotate-180 "
          onClick={handleClose}
        />

        {chatRoomId && (
          <Image
            src={goToBack}
            width={16}
            alt="뒤로가기 버튼"
            quality={10}
            className="absolute left-5 top-6"
            onClick={handleGoBack}
          />
        )}
      </div>

      {chatRoomId ? (
        <ChatRoom roomId={chatRoomId} />
      ) : (
        <div>
          <div className="text-title p-6">주변 사람들과 대화해보세요</div>
          <div className="flex flex-wrap flex-col items-center gap-4 w-full">
            <div className="w-11/12 border border-Green px-4 py-3 rounded-md flex justify-between items-center">
              <div className="w-9/12">
                <p className="w-full">룰루</p>
                <p>안녕하세요 !</p>
                <p className="text-description text-Gray">
                  2024. 12. 18 05: 21 pm
                </p>
              </div>
              <div className="text-Green">1</div>
            </div>
            <div className="w-11/12 border border-Gray px-4 py-3 rounded-md flex justify-between items-center">
              <div className="w-9/12">
                <p className="w-full">룰루</p>
                <p>안녕하세요 !</p>
                <p className="text-description text-Gray">
                  2024. 12. 18 05: 21 pm
                </p>
              </div>
              <div className="text-Green"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
