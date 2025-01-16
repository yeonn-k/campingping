import Image from 'next/image';

import chat from '@icons/chat_green.svg';

interface OpenTheChatsProps {
  onClick: () => void;
}

const OpenTheChats = ({ onClick }: OpenTheChatsProps) => {
  return (
    <button
      className="fixed bottom-36 right-0 translate-x-[-64px] bg-white p-4 rounded-full shadow-shadowCustom w-14 h-14 z-[18]"
      onClick={onClick}
    >
      <Image src={chat} alt="채팅방" width={24} />
    </button>
  );
};

export default OpenTheChats;
