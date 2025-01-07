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
