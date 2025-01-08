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
