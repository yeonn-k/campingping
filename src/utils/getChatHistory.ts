// chatting 관련 함수들 정리 필요

import { socket } from '@/socket';

import { chattingStore } from '@/stores/chattingState';
import { ChatHistoryData, ChatMsgs } from '@/types/Chatting';
import { useState } from 'react';

const { chatRoomId } = chattingStore();

const [, setChatMsgs] = useState<ChatMsgs[]>([]);
const [, setNextCursor] = useState<number | null | undefined>(null);

export const getChatHistory = () => {
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
