'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { socket } from '@/socket';

import Button from '@/components/Button/Button';
import MyChatMsg from './MyChatMsg';
import UrChatMsg from './UrChatMsg';

import profileGreen from '@icons/profile_green.svg';

import { ChatHistoryData, ChatMsgs } from '@/types/Chatting';

import { userStore } from '@/stores/userState';
import { chattingStore } from '@/stores/chattingState';
import useInputValue from '@/hooks/useInputValue';
import { useIsMobile } from '@/hooks/useIsMobile';
import { api } from '@/utils/axios';

import { toast } from 'react-toastify';

interface ChatRoomProps {
  roomId: number;
  setChatRoomId: (v: number | null) => void;
  nickname: string;
}
const ChatRoom = ({ nickname, setChatRoomId }: ChatRoomProps) => {
  const { userEmail } = userStore();
  const [inputValue, handleInputChange, resetInput] = useInputValue();
  const { chatRoomId } = chattingStore();
  const [chatMsgs, setChatMsgs] = useState<ChatMsgs[]>();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useIsMobile();
  const [nextCursor, setNextCursor] = useState<number | null | undefined>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const getChatHistory = () => {
    socket.emit('getChatHistory', {
      roomId: chatRoomId,
    });
  };

  useEffect(() => {
    getChatHistory();
  }, [chatRoomId]);

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
    const handleNewMessage = () => {
      getChatHistory();
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, []);

  const getOutFromRoom = async () => {
    const res = await api.delete(`/chats/rooms/${chatRoomId}`);

    if (res.status === 200) {
      toast.success('채팅방이 삭제되었습니다 🚪');

      setChatRoomId(null);
    }
  };

  const handleGetChatting = ({ chatHistory, nextCursor }: ChatHistoryData) => {
    setChatMsgs(chatHistory || []);
    if (nextCursor !== null && nextCursor !== undefined) {
      setNextCursor(nextCursor);
    } else {
      setNextCursor(null);
    }
  };

  socket.on('chatHistory', handleGetChatting);

  useEffect(() => {
    if (nextCursor !== null) {
      socket.emit('getChatHistory', { roomId: chatRoomId, cursor: nextCursor });
    }
  }, [nextCursor]);

  useEffect(() => {
    if (!chatContainerRef.current) return;

    const container = chatContainerRef.current;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatMsgs]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatRoomId]);

  const lastChatRef = useCallback((node: HTMLDivElement) => {
    console.log(nextCursor);
    if (nextCursor === null || nextCursor === undefined) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('첫 번째 메시지에 도달');
          if (nextCursor) {
            socket.emit('getChatHistory', {
              roomId: chatRoomId,
              cursor: nextCursor,
            });
          }
        }
      },
      { threshold: 0 }
    );

    if (node) {
      observerRef.current.observe(node);
    }
  }, []);

  return (
    <div className="relative h-full flex flex-col ">
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

          <button className="text-Green" onClick={getOutFromRoom}>
            대화 나가기
          </button>
        </div>
      </div>
      <div
        className={`overflow-auto ${isMobile ? 'h-3/5' : 'h-5/6'} flex flex-col-reverse`}
        ref={chatContainerRef}
      >
        {chatMsgs?.map((chat, idx) => {
          const isLastChat = idx === chatMsgs.length - 1;
          const refProp = isLastChat ? { ref: lastChatRef } : {};
          return chat.author.email === userEmail ? (
            <MyChatMsg
              // key={chat.id}
              message={chat.message}
              createdAt={chat.createdAt}
              isRead={chat.isRead}
              {...refProp}
            />
          ) : (
            <UrChatMsg
              // key={chat.id}
              message={chat.message}
              createdAt={chat.createdAt}
              nickname={chat.author.nickname}
              {...refProp}
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
