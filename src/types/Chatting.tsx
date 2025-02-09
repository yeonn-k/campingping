export interface ChatRooms {
  roomId: number;
  createdAt: string;
  users: [
    {
      email: string;
      nickname: string;
    },
  ];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface sendMessage {
  roomId: number;
  message: string;
  createdAt: string;
  sender: {
    email: string;
    nickname: string;
  };
}

export interface ChatMsgs {
  message: string;
  createdAt: string;
  author: {
    email: string;
    nickname: string;
  };
}
