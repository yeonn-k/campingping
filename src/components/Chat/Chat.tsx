'use client';
import Image from 'next/image';

import { useEffect, useState } from 'react';
import { socket } from '../../socket';

import { CHAT } from '@/constants/chat/chatEvents';

import ChatBox from './ChatBox';
import ChatRoom from './ChatRoom/ChatRoom';

import chevron from '@icons/chevron_gray.svg';
import goToBack from '@icons/goToBack.svg';

import { chattingStore } from '@/stores/chattingState';
import { userStore } from '@/stores/userState';

import { onConnect } from '@/utils/chat/handleSocket';
import useChat from '@/hooks/chat/useChat';
import { ChatRooms } from '@/types/Chatting';
import ModalBox from '../ModalBox/ModalBox';

const Chat = () => {
  const [, setIsConnected] = useState(false);
  const [, setTransport] = useState('N/A');
  const { userState } = userStore();

  const [chats, setChats] = useState<ChatRooms[]>([]);

  const { getChatRooms, closeChats } = useChat();

  const { chatState, chatRoomId, setChatRoomId, setChatNick, chatNick } =
    chattingStore();

  useEffect(() => {
    if (!userState) return;

    if (socket.connected) {
      onConnect(setIsConnected, setTransport);
    }

    socket.on('connect', () => onConnect(setIsConnected, setTransport));
    socket.on('disconnect', (reason) => {
      console.warn('Socket 연결 해제:', reason);
      if (reason === 'ping timeout') {
        console.warn('아이폰에서 소켓 연결이 끊어짐. 재연결 시도 중...');
        socket.connect();
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [userState]);

  const handleChatRooms = (rooms: ChatRooms[]) => {
    setChats(rooms);
  };

  useEffect(() => {
    if (!socket) return;

    getChatRooms();

    if (!socket.connected) {
      socket.on('connect', getChatRooms);
    }

    return () => {
      socket.off('connect', getChatRooms);
    };
  }, []);

  useEffect(() => {
    const handleUserLeftRoom = () => {
      getChatRooms();
    };

    socket.on(CHAT.USER.LEFT, handleUserLeftRoom);

    return () => {
      socket.off(CHAT.USER.LEFT, handleUserLeftRoom);
    };
  }, [chats, getChatRooms]);

  useEffect(() => {
    socket.on(CHAT.ROOM.RECEIVE, handleChatRooms);

    return () => {
      socket.off(CHAT.ROOM.RECEIVE, handleChatRooms);
    };
  }, [chats, getChatRooms]);

  const handleNewMsg = () => {
    getChatRooms();
  };
  useEffect(() => {
    socket.on(CHAT.HISTORY.NEW, handleNewMsg);

    return () => {
      socket.off(CHAT.HISTORY.NEW, handleNewMsg);
    };
  }, [getChatRooms]);

  return (
    <ModalBox>
      <div className="absolute inset-0 h-full w-full">
        <div
          className={`bg-white absolute w-full ${chatState ? 'h-5/6 w-full right-0 bottom-0 md:h-1/2 md:w-1/3 md:rounded-3xl md:bottom-20 md:right-24' : 'h-0'} rounded-t-2xl overflow-hidden flex flex-col shadow-mapListShadow transition-all duration-500 ease-in-out z-zChat`}
        >
          <div className="relative flex justify-center ">
            <Image
              src={chevron}
              alt="화살표 아이콘"
              width={16}
              quality={10}
              className="pb-2 mb-4 mt-3 origin-center rotate-180 "
              onClick={closeChats}
            />

            {chatRoomId && (
              <Image
                src={goToBack}
                width={16}
                alt="뒤로가기 버튼"
                quality={10}
                className="absolute left-5 top-6"
                onClick={() => {
                  setChatRoomId(null);
                  getChatRooms();
                }}
              />
            )}
          </div>

          {chatRoomId === null ? (
            <div>
              <div className="text-title p-6">주변 사람들과 대화해보세요</div>
              <div className="flex flex-wrap items-center justify-center w-full h-auto pb-12">
                {chats.length > 0 ? (
                  chats.map((chat) => {
                    const handleChatRoomClick = () => {
                      if (chatRoomId !== chat.roomId) {
                        setChatRoomId(chat.roomId);
                      }
                      if (chatNick !== chat.users[0].nickname) {
                        setChatNick(chat.users[0].nickname);
                      }
                    };

                    return (
                      <div
                        key={chat.roomId}
                        className="w-full flex justify-center mb-4"
                        onClick={handleChatRoomClick}
                      >
                        <ChatBox
                          roomId={chat.roomId}
                          nickname={chat.users[0].nickname}
                          lastMsg={chat.lastMessage}
                          lastMsgTime={chat.lastMessageTime}
                          unreadCount={chat.unreadCount}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center">
                    참여 중인 채팅이 없어요 !
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ChatRoom
              roomId={chatRoomId}
              setChatRoomId={setChatRoomId}
              nickname={chatNick}
            />
          )}
        </div>
      </div>
    </ModalBox>
  );
};

export default Chat;
