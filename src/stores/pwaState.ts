import { create } from 'zustand';

interface PwaState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isPwaOpen: boolean;
  modalType: string;
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  setIsPwaOpen: (v: boolean, text?: string) => void;
}

export const usePwaStore = create<PwaState>((set) => ({
  deferredPrompt: null,
  isPwaOpen: false,
  modalType: '',
  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
  setIsPwaOpen: (v, text) => set(() => ({ isPwaOpen: v, modalType: text })),
}));
