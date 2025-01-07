import { useState } from 'react';

export const useChatState = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);

  const handleGoBack = () => {
    setChatRoomId(null);
  };

  const handleChatState = () => {
    setIsChatOpen((prev) => !prev);
  };

  return {
    isChatOpen,
    setIsChatOpen,
    chatRoomId,
    setChatRoomId,
    handleChatState,
    handleGoBack,
  };
};
