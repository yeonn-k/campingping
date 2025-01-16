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

interface ChatRoomProps {
  roomId: number;
  nickname: string;
}
const ChatRoom = ({ nickname }: ChatRoomProps) => {
  const { userEmail } = userStore();
  const [inputValue, handleInputChange, resetInput] = useInputValue();
  const { chatRoomId } = chattingStore();
  const [chatMsg] = useState<sendMessage>();
  const [chatMsgs, setChatMsgs] = useState<ChatMsgs[]>();
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleChatting = (data: sendMessage) => {
      const { sender, message, createdAt } = data;

      setChatMsgs((prev) => {
        if (!prev) {
          return [
            {
              message: message,
              createdAt: createdAt,
              author: {
                email: sender.email,
                nickname: sender.nickname,
              },
            },
          ];
        }

        const isDuplicate = prev.some((msg) => msg.createdAt === createdAt);
        if (isDuplicate) return prev;

        return [
          ...prev,
          {
            message: message,
            createdAt: createdAt,
            author: {
              email: sender.email,
              nickname: sender.nickname,
            },
          },
        ];
      });
    };

    socket.on('newMessage', handleChatting);

    return () => {
      socket.off('newMessage', handleChatting);
    };
  }, [chatMsgs]);

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
    const handleChatting = (data: sendMessage) => {
      const { message, createdAt, sender } = data;
      setChatMsgs((prev) => {
        if (!prev)
          return [
            {
              message: message,
              createdAt: createdAt,
              author: {
                email: sender.email,
                nickname: sender.nickname,
              },
            },
          ];

        const isDuplicate = prev.some((msg) => msg.createdAt === createdAt);
        if (isDuplicate) return prev;

        return [
          ...prev,
          {
            message: message,
            createdAt: createdAt,
            author: {
              email: sender.email,
              nickname: sender.nickname,
            },
          },
        ];
      });
    };

    socket.on('newMessage', handleChatting);

    return () => {
      socket.off('newMessage', handleChatting);
    };
  }, [chatMsg]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
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
              <span className="text-bold mr-1 text-[20px]">{nickname}</span>
              <span className="text-description text-Gray">님과의 대화</span>
            </div>
          </div>

          <button className="text-Green">대화 나가기</button>
        </div>
      </div>
      <div className="overflow-auto h-[55%]" ref={chatContainerRef}>
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
      <div className="border-t border-Green w-full h-40 flex justify-center items-center">
        <textarea
          placeholder="채팅을 입력하세요"
          className="w-64 h-36 outline-none	pt-2 pr-3"
          value={inputValue}
          onChange={handleInputChange}
        ></textarea>
        <Button height="h-24" onClick={handleSendMessage}>
          전송
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;
