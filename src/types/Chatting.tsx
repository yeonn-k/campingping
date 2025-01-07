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
  isRead: boolean;
}

export interface CreateChat {
  roomId: number;
  message: string;
}

export interface sendMessage {
  roomId: number;
  sender: string;
  message: string;
  createdAt: string;
}

export interface ChatMsgs {
  id: number;
  message: string;
  createdAt: string;
  author: {
    email: string;
    nickname: string;
  };
}
