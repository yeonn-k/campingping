import { socket } from '@/socket';
import { chattingStore } from '@/stores/chattingState';
import { ChatHistoryData, ChatMsgs } from '@/types/Chatting';
import { useState, useEffect } from 'react';

export const useChatHistory = () => {
  const { chatRoomId } = chattingStore();
  const [chatMsgs, setChatMsgs] = useState<ChatMsgs[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null | undefined>(null);

  useEffect(() => {
    const getChatHistory = () => {
      socket.emit('getChatHistory', { roomId: chatRoomId });

      socket.off('newMessage');
      socket.on('newMessage', getChatHistory);

      socket.on(
        'chatHistory',
        ({ chatHistory, nextCursor }: ChatHistoryData) => {
          setChatMsgs(chatHistory);
          if (typeof nextCursor === 'number') {
            setNextCursor(nextCursor);
          }
        }
      );
    };

    getChatHistory();

    return () => {
      socket.off('newMessage');
      socket.off('chatHistory');
    };
  }, [chatRoomId]);

  return { chatMsgs, nextCursor };
};
