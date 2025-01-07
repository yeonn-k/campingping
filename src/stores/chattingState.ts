import { create } from 'zustand';

interface ChatState {
  chatState: boolean;
  chatRoomId: number | null;
  setChatState: () => void;
  setChatRoomId: (v: number | null) => void;
}

export const chattingStore = create<ChatState>((set) => ({
  chatState: false,
  chatRoomId: null,
  setChatState: () =>
    set((state) => ({
      chatState: !state.chatState,
    })),
  setChatRoomId: (v) =>
    set(() => ({
      chatRoomId: v,
    })),
}));
