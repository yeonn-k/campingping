import Image from 'next/image';

import chat from '@icons/chat_green.svg';
import { usePathname } from 'next/navigation';

interface OpenTheChatsProps {
  onClick: () => void;
}

const OpenTheChats = ({ onClick }: OpenTheChatsProps) => {
  const pathname = usePathname();

  if (
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname === '/search'
  )
    return;

  return (
    <button
      className="fixed bottom-[9.5rem] right-0 translate-x-[-14px] bg-white p-4 rounded-full shadow-shadowCustom w-14 h-14 z-[18]"
      onClick={onClick}
    >
      <Image src={chat} alt="채팅방" width={24} />
    </button>
  );
};

export default OpenTheChats;
