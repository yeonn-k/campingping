'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { socket } from '@/socket';
import { toast } from 'react-toastify';

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

interface ChatRoomProps {
  roomId: number;
  setChatRoomId: (v: number | null) => void;
  nickname: string;
}
const ChatRoom = ({ nickname, setChatRoomId }: ChatRoomProps) => {
  const { userEmail } = userStore();
  const { chatRoomId } = chattingStore();
  const { isMobile } = useIsMobile();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const chatMsgsRef = useRef<ChatMsgs[]>([]);
  const [chatMsgs, setChatMsgs] = useState<ChatMsgs[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null | undefined>(null);

  const [inputValue, handleInputChange, resetInput] = useInputValue();

  const [isNewMessage, setIsNewMessage] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const isInitial = useRef<boolean>(true);

  const getChatHistory = () => {
    socket.emit('getChatHistory', {
      roomId: chatRoomId,
    });

    socket.off('newMessage');
    socket.on('newMessage', getChatHistory);

    socket.on('chatHistory', ({ chatHistory, nextCursor }: ChatHistoryData) => {
      setChatMsgs(chatHistory);

      if (typeof nextCursor === 'number') {
        setNextCursor(nextCursor);
      }
    });
  };

  useEffect(() => {
    getChatHistory();

    socket.emit('openChatRoom', { roomId: chatRoomId });
  }, [chatRoomId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }

    isInitial.current = false;
  }, []);

  const sendChatMsg = (inputValue: string, chatRoomId: number) => {
    socket.emit('sendMessage', {
      message: inputValue,
      room: chatRoomId,
    });

    setIsNewMessage(true);
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
    chatMsgsRef.current = chatMsgs;
  }, [chatMsgs]);

  const handleGetChatting = ({ chatHistory, nextCursor }: ChatHistoryData) => {
    if (isInitial) {
      console.log('check');

      setChatMsgs(() => {
        const currentMsgs = chatMsgsRef.current;

        const existingMsgIds = new Set(currentMsgs.map((msg) => msg.id));
        const filteredNewMsgs = chatHistory.filter(
          (msg) => !existingMsgIds.has(msg.id)
        );

        const updatedMsgs = [...filteredNewMsgs, ...currentMsgs];

        return updatedMsgs;
      });

      setNextCursor(nextCursor ?? null);

      if (chatContainerRef.current) {
        const currentScrollHeight = chatContainerRef.current.scrollHeight;
        chatContainerRef.current.scrollTo({
          top: currentScrollHeight * 0.08,
          // behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    if (!chatContainerRef.current) return;
    if (!isNewMessage) return;

    const container = chatContainerRef.current;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatMsgs]);

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;

    const { scrollTop } = chatContainerRef.current;

    if (scrollTop === 0 && nextCursor) {
      if (debounceTimeout.current) return;
      debounceTimeout.current = setTimeout(() => {
        setIsNewMessage(false);
        socket.emit('getChatHistory', {
          roomId: chatRoomId,
          cursor: nextCursor,
        });

        socket.on('chatHistory', handleGetChatting);

        setTimeout(() => {
          debounceTimeout.current = null;
        }, 100);
      }, 300);
    }
  }, [chatRoomId, nextCursor]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', handleScroll);
      }
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (chatContainerRef.current && hasScrolled && nextCursor) {
      socket.emit('getChatHistory', {
        roomId: chatRoomId,
        cursor: nextCursor,
      });

      const handleChatHistory = (data: ChatHistoryData) => {
        handleGetChatting(data);
      };

      socket.on('chatHistory', handleChatHistory);

      setHasScrolled(false);

      return () => {
        socket.off('chatHistory', handleChatHistory);
      };
    }

    if (!isInitial.current) {
      setTimeout(() => {
        isInitial.current = true;
      }, 1000);
    }
  }, [hasScrolled, nextCursor, chatRoomId, handleGetChatting]);

  const updateRead = () => {
    const updatedChatHistory = chatMsgs?.map((chat) => ({
      ...chat,
      isRead: true,
    }));

    setChatMsgs(updatedChatHistory);
  };

  socket.on('updateRead', updateRead);

  const getOutFromRoom = async () => {
    const res = await api.delete(`/chats/rooms/${chatRoomId}`);

    if (res.status === 200) {
      toast.success('채팅방이 삭제되었습니다 🚪');

      setChatRoomId(null);
    }
  };

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
        className={`overflow-auto ${isMobile ? 'h-3/5' : 'h-5/6'} `}
        ref={chatContainerRef}
      >
        {chatMsgs?.map((chat) => {
          return chat.author.email === userEmail ? (
            <MyChatMsg
              key={chat.id}
              message={chat.message}
              createdAt={chat.createdAt}
              isRead={chat.isRead}
            />
          ) : (
            <UrChatMsg
              key={chat.id}
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
