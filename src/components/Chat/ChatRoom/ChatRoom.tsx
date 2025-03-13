'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { socket } from '@/socket';
// import { toast } from 'react-toastify';

import { CHAT } from '@/constants/chat/chatEvents';

import Button from '@/components/Button/Button';
import MyChatMsg from './MyChatMsg';
import UrChatMsg from './UrChatMsg';

import profileGreen from '@icons/profile_green.svg';

import {
  ChatHistoryData,
  ChatMsgs,
  newMessage,
  UpdateMsg,
} from '@/types/Chatting';

import { userStore } from '@/stores/userState';
import { chattingStore } from '@/stores/chattingState';
import useInputValue from '@/hooks/useInputValue';
import { useIsMobile } from '@/hooks/useIsMobile';

import useChat from '@/hooks/chat/useChat';
import NewChatMsg from './NewChatMsg';

interface ChatRoomProps {
  roomId: number;
  setChatRoomId: (v: number | null) => void;
  nickname: string;
}

const ChatRoom = ({ nickname, setChatRoomId }: ChatRoomProps) => {
  const { userEmail } = userStore();
  const { chatRoomId } = chattingStore();
  const { isMobile } = useIsMobile();

  const {
    setNextCursor,
    nextCursor,
    handleUserRead,
    getChatHistory,
    sendChatMsg,
    updateRead,
    getOutFromRoom,
  } = useChat();

  const isInitial = useRef<boolean>(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const firstObserverRef = useRef<IntersectionObserver | null>(null);
  const lastObserverRef = useRef<IntersectionObserver | null>(null);

  const [chatMsgs, setChatMsgs] = useState<ChatMsgs[]>([]);
  const chatMsgsRef = useRef<ChatMsgs[]>([]);
  const [isNewMsg, setIsNewMsg] = useState(false);
  const [newMsg, setNewMsg] = useState<string | null>(null);

  const [inputValue, handleInputChange, resetInput] = useInputValue();

  const [hasScrolled, setHasScrolled] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [isNearTop, setIsNearTop] = useState(false);

  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!chatRoomId) return;

    getChatHistory();
    handleUserRead();
  }, [chatRoomId]);

  useEffect(() => {
    socket.off(CHAT.HISTORY.NEW);
    socket.on(CHAT.HISTORY.NEW, (data: newMessage) => {
      setIsNewMsg(true);
      setNewMsg(data.message);

      getChatHistory();
    });

    socket.on(
      CHAT.HISTORY.FETCHED,
      ({ chatHistory, nextCursor }: ChatHistoryData) => {
        setChatMsgs((prevMsgs) => {
          const existingMsgIds = new Set(prevMsgs.map((msg) => msg.id));
          const filteredNewMsgs = chatHistory.filter(
            (msg) => !existingMsgIds.has(msg.id)
          );
          return [...prevMsgs, ...filteredNewMsgs];
        });

        if (typeof nextCursor === 'number') {
          setNextCursor(nextCursor);
        }
      }
    );

    return () => {
      socket.off(CHAT.HISTORY.NEW, getChatHistory);
      socket.off(CHAT.HISTORY.FETCHED);
    };
  }, [isNewMsg, newMsg, isNearBottom]);

  useEffect(() => {
    if (!isInitial.current) return;
    if (!chatContainerRef.current) return;
    if (chatMsgs.length === 0) return;

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }

    isInitial.current = false;
  }, [chatMsgs]);

  const handleSendMessage = async () => {
    if (chatRoomId !== null && inputValue) {
      sendChatMsg(inputValue, chatRoomId);
      resetInput();
    } else {
      console.error('Chat room ID or msg is null.');
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
    if (!isInitial.current) {
      setIsNewMsg(false);
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
          top: currentScrollHeight * 0.057,
          // behavior: 'smooth',
        });
      }
    }
  };

  const firstChatRef = useCallback((node: HTMLDivElement) => {
    if (firstObserverRef.current) firstObserverRef.current.disconnect();

    firstObserverRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearTop(entry.isIntersecting);
        }
      },
      { threshold: 1 }
    );

    if (node) {
      firstObserverRef.current.observe(node);
    }
  }, []);

  const lastChatRef = useCallback((node: HTMLDivElement) => {
    if (lastObserverRef.current) lastObserverRef.current.disconnect();

    lastObserverRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNewMsg(false);
        }
        setIsNearBottom(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (node) {
      lastObserverRef.current.observe(node);
    }
  }, []);

  useEffect(() => {
    if (!chatContainerRef.current) return;

    if (isNearBottom && isNewMsg) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatMsgs]);

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;

    const { scrollTop } = chatContainerRef.current;

    if (scrollTop === 0 && nextCursor) {
      if (debounceTimeout.current) return;

      debounceTimeout.current = setTimeout(() => {
        socket.emit(CHAT.HISTORY.FETCH, {
          roomId: chatRoomId,
          cursor: nextCursor,
        });

        socket.on(CHAT.HISTORY.FETCHED, handleGetChatting);

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
    if (chatContainerRef.current && hasScrolled && isNearTop && nextCursor) {
      socket.emit(CHAT.HISTORY.FETCH, {
        roomId: chatRoomId,
        cursor: nextCursor,
      });

      const handleChatHistory = (data: ChatHistoryData) => {
        handleGetChatting(data);
      };

      socket.on(CHAT.HISTORY.FETCH, handleChatHistory);

      setHasScrolled(false);

      return () => {
        socket.off(CHAT.HISTORY.FETCHED, handleChatHistory);
      };
    }
  }, [hasScrolled, nextCursor, chatRoomId, handleGetChatting]);

  useEffect(() => {
    const handleUpdateRead = (data: UpdateMsg) => {
      if (data.roomId === chatRoomId) {
        updateRead(data, chatMsgs, setChatMsgs);
      }
    };
    socket.off(CHAT.HISTORY.UPDATE, handleUpdateRead);
    socket.on(CHAT.HISTORY.UPDATE, handleUpdateRead);

    return () => {
      socket.off(CHAT.HISTORY.UPDATE, handleUpdateRead);
    };
  }, [chatRoomId, chatMsgs, setChatMsgs]);

  const userLeft = () => {
    setClosed(true);
  };

  socket.on(CHAT.USER.LEFT, userLeft);

  return (
    <div className="relative h-full flex flex-col pb-12">
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

          <button
            className="text-Green"
            onClick={closed ? () => setChatRoomId(null) : getOutFromRoom}
          >
            대화 나가기
          </button>
        </div>
      </div>
      <div
        className={`overflow-auto ${isMobile ? 'h-3/5' : 'h-5/6'} relative`}
        ref={chatContainerRef}
      >
        {chatMsgs?.map((chat, idx) => {
          return chat.author.email === userEmail ? (
            <MyChatMsg
              key={chat.id}
              message={chat.message}
              createdAt={chat.createdAt}
              isRead={chat.isRead}
              ref={
                idx === chatMsgs.length - 1
                  ? lastChatRef
                  : idx === 1
                    ? firstChatRef
                    : null
              }
            />
          ) : (
            <UrChatMsg
              key={chat.id}
              message={chat.message}
              createdAt={chat.createdAt}
              nickname={chat.author.nickname}
              ref={
                idx === chatMsgs.length - 1
                  ? lastChatRef
                  : idx === 1
                    ? firstChatRef
                    : null
              }
            />
          );
        })}
        {!isNearBottom && newMsg && isNewMsg && (
          <NewChatMsg
            nickname={nickname}
            message={newMsg}
            chatContainerRef={chatContainerRef}
            setNewMsg={setNewMsg}
          />
        )}

        {closed && (
          <div className="flex justify-center">
            <div className="flex justify-center items-center bg-LightGray rounded-2xl text-white px-3 py-1 my-4">
              상대방이 채팅을 떠났습니다
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-Green w-full h-32 flex justify-center items-center gap-3 p-4">
        <textarea
          placeholder="채팅을 입력하세요"
          className="w-full h-24 outline-none	px-1 resize-none rounded-lg"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleEnter}
          disabled={closed}
        ></textarea>
        <Button height="h-24" onClick={handleSendMessage}>
          전송
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;
