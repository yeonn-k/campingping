'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { socket } from '@/socket';

import Button from '@/components/Button/Button';
import MyChatMsg from './MyChatMsg';
import UrChatMsg from './UrChatMsg';

import profileGreen from '@icons/profile_green.svg';

import { ChatMsgs, sendMessage } from '@/types/Chatting';

import { userStore } from '@/stores/userState';
import { chattingStore } from '@/stores/chattingState';
import useInputValue from '@/hooks/useInputValue';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ChatRoomProps {
  roomId: number;
  nickname: string;
}
const ChatRoom = ({ nickname }: ChatRoomProps) => {
  const { userEmail } = userStore();
  const [inputValue, handleInputChange, resetInput] = useInputValue();
  const { chatRoomId } = chattingStore();
  const [chatMsgs, setChatMsgs] = useState<ChatMsgs[]>();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useIsMobile();

  const getChatHistory = () => {
    socket.emit('getChatHistory', {
      roomId: chatRoomId,
      page: 1,
      limit: 100,
    });
  };

  useEffect(() => {
    getChatHistory();
  }, []);

  const sendChatMsg = (inputValue: string, chatRoomId: number) => {
    socket.emit('sendMessage', {
      message: inputValue,
      room: chatRoomId,
    });
  };

  const handleSendMessage = async () => {
    if (chatRoomId !== null) {
      sendChatMsg(inputValue, chatRoomId);
      resetInput();
    } else {
      console.error('Chat room ID is null.');
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue && chatRoomId !== null) {
        if (e.nativeEvent.isComposing) {
          e.stopPropagation();
          return;
        }

        const messageToSend = inputValue;

        sendChatMsg(messageToSend, chatRoomId);

        resetInput();
      }
    }
  };

  useEffect(() => {
    const handleChatting = (data: sendMessage) => {
      const { sender, message, createdAt } = data;

      setChatMsgs((prev) => {
        if (!prev)
          return [
            {
              message,
              createdAt,
              author: { email: sender.email, nickname: sender.nickname },
            },
          ];

        const isDuplicate = prev.some((msg) => msg.createdAt === createdAt);
        if (isDuplicate) return prev;

        return [
          ...prev,
          {
            message,
            createdAt,
            author: { email: sender.email, nickname: sender.nickname },
          },
        ];
      });
    };

    socket.on('newMessage', handleChatting);

    return () => {
      socket.off('newMessage', handleChatting);
    };
  }, [chatRoomId]); //chatMsgs, chatMsg

  useEffect(() => {
    const handleGetChatting = (data: ChatMsgs[]) => {
      setChatMsgs(data);
    };
    socket.on('chatHistory', handleGetChatting);

    return () => {
      socket.off('chatHistory', handleGetChatting);
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatMsgs]);

  return (
    <div className="relative h-full flex flex-col">
      <div className="mt-1 ">
        <div className="px-6 pt-1 pb-2 flex gap-1 justify-between border-b border-Green">
          <div className="flex gap-1">
            <Image
              src={profileGreen}
              width={20}
              alt="프로필 아이콘"
              quality={10}
            />
            <div className="items-baseline ">
              <span className="text-bold mr-1 text-[20px]">{nickname}</span>
              <span className="text-description text-Gray">님과의 대화</span>
            </div>
          </div>

          <button className="text-Green">대화 나가기</button>
        </div>
      </div>
      <div
        className={`overflow-auto ${isMobile ? 'h-3/5' : 'h-5/6'}`}
        ref={chatContainerRef}
      >
        {chatMsgs?.map((chat) => {
          return chat.author.email === userEmail ? (
            <MyChatMsg
              user={chat.author.email}
              message={chat.message}
              createdAt={chat.createdAt}
            />
          ) : (
            <UrChatMsg
              user={chat.author.email}
              message={chat.message}
              createdAt={chat.createdAt}
              nickname={chat.author.nickname}
            />
          );
        })}
      </div>
      <div
        className={`border-t border-Green w-full  ${isMobile ? 'h-32' : 'h-40'} flex justify-center items-center p-4`}
      >
        <textarea
          placeholder="채팅을 입력하세요"
          className={`w-full  ${isMobile ? 'h-24' : 'h-36'} outline-none	pt-2 pr-3 resize-none `}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleEnter}
        ></textarea>
        <Button height="h-24" onClick={handleSendMessage}>
          전송
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;
