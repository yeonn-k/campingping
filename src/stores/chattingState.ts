import { create } from 'zustand';

interface ChatState {
  chatState: boolean;
  chatRoomId: number | null;
  chatNick: string;
  setChatState: () => void;
  setChatRoomId: (v: number | null) => void;
  setChatNick: (v: string) => void;
}

export const chattingStore = create<ChatState>((set) => ({
  chatState: false,
  chatRoomId: null,
  chatNick: '',
  setChatState: () =>
    set((state) => ({
      chatState: !state.chatState,
    })),
  setChatRoomId: (v) =>
    set(() => ({
      chatRoomId: v,
    })),
  setChatNick: (v) =>
    set(() => ({
      chatNick: v,
    })),
}));
