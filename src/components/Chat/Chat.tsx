'use client';
import Image from 'next/image';

import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { socket } from '../../socket';

import ChatBox from './ChatBox';
import ChatRoom from './ChatRoom/ChatRoom';

import chevron from '@icons/chevron_gray.svg';
import goToBack from '@icons/goToBack.svg';

import { ChatMsgs, ChatRooms } from '@/types/Chatting';
import { chattingStore } from '@/stores/chattingState';
import { userStore } from '@/stores/userState';

const Chat = () => {
  const [, setIsConnected] = useState(false);
  const [, setTransport] = useState('N/A');
  const [chats, setChats] = useState<ChatRooms[]>([]);
  const { userState } = userStore();
  const [newChat] = useState<ChatMsgs>();

  const {
    chatState,
    chatRoomId,
    setChatState,
    setChatRoomId,
    setChatNick,
    chatNick,
  } = chattingStore();

  const onConnect = () => {
    if (userState) {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on(
        'upgrade',
        (transport: { name: SetStateAction<string> }) => {
          setTransport(transport.name);
        }
      );
    }
  };

  const onDisconnect = () => {
    setIsConnected(false);
    setTransport('N/A');
  };

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const getChatRooms = useCallback(() => {
    socket.emit('getChatRooms');

    socket.on('chatRooms', (rooms: ChatRooms[]) => {
      setChats(rooms);
    });

    return () => {
      socket.off('chatRooms');
    };
  }, [chatRoomId]);

  useEffect(() => {
    getChatRooms();
  }, []);

  const newRoom = () => {
    const newMsgId = newChat ? newChat.id : '';
    const roomExist = chats.some((chat) => chat.roomId === newMsgId);

    if (!roomExist) getChatRooms();
  };

  useEffect(() => {
    const handleNewMessage = () => {
      newRoom();
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [newRoom]);

  const closeChats = () => {
    setChatState(false);
    setChatRoomId(null);
  };

  useEffect(() => {
    const handleUserLeftRoom = () => {
      if (chats.length > 0) {
        getChatRooms();
      }
    };

    socket.on('userLeftRoom', handleUserLeftRoom);

    return () => {
      socket.off('userLeftRoom', handleUserLeftRoom);
    };
  }, [getChatRooms]);

  return (
    <div
      className={`bg-white fixed bottom-0 w-full max-w-[450px] ${chatState ? 'h-5/6' : 'h-0'} rounded-t-2xl overflow-hidden flex flex-col shadow-mapListShadow transition-all duration-500 ease-in-out z-zChat`}
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
            onClick={() => setChatRoomId(null)}
          />
        )}
      </div>

      {chatRoomId === null ? (
        <div>
          <div className="text-title p-6">주변 사람들과 대화해보세요</div>
          <div className="flex flex-wrap flex-col items-center gap-4 w-full pb-12">
            {chats.length > 0 ? (
              chats.map((chat) => {
                return (
                  <div
                    key={chat.roomId}
                    className="w-full flex justify-center"
                    onClick={() => {
                      setChatRoomId(chat.roomId);
                      setChatNick(chat.users[0].nickname);
                    }}
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
              <div className="h-full items-center">
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
  );
};

export default Chat;
