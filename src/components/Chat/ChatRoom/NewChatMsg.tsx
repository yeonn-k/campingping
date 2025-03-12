import React from 'react';
import Image from 'next/image';
import chevron from '@icons/chevron_green.svg';

interface NewChatMsgProps {
  chatContainerRef: React.RefObject<HTMLDivElement>;
  message: string;
  nickname: string;
  setNewMsg: React.Dispatch<React.SetStateAction<string | null>>;
}

const NewChatMsg = ({
  chatContainerRef,
  nickname,
  message,
  setNewMsg,
}: NewChatMsgProps) => {
  const handleNewMsg = () => {
    if (!chatContainerRef.current) return;

    const container = chatContainerRef.current;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });

    setNewMsg(null);
  };
  return (
    <div
      className="sticky bottom-3 mx-3 left-3 right-3 bg-white"
      onClick={handleNewMsg}
    >
      <div className="w-full h-14  border border-Green p-3 bg-Green/30 rounded-2xl flex items-center flex-wrap shadow-lg cursor-pointer z-6">
        <p className="mr-2 w-14 truncate overflow-hidden font-semibold">
          {nickname}
        </p>
        <p className="flex-1 truncate overflow-hidden">{message}</p>
        <Image
          src={chevron}
          alt="화살표"
          width={18}
          height={18}
          className="scale-y-[-1]"
        />
      </div>
    </div>
  );
};

export default NewChatMsg;
