import { create } from 'zustand';

interface PwaState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isPwaOpen: boolean;
  clicked: string;
  modalType: string;
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  setClicked: (v: string) => void;
  setIsPwaOpen: (v: boolean, text?: string) => void;
}

export const usePwaStore = create<PwaState>((set) => ({
  deferredPrompt: null,
  isPwaOpen: false,
  clicked: '',
  modalType: '',
  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
  setClicked: (v) => set({ clicked: v }),
  setIsPwaOpen: (v, text) => set(() => ({ isPwaOpen: v, modalType: text })),
}));
