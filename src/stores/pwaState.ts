import { create } from 'zustand';

interface PwaState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isPwaOpen: boolean;
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  setIsPwaOpen: (open: boolean) => void;
}

export const usePwaStore = create<PwaState>((set) => ({
  deferredPrompt: null,
  isPwaOpen: false,
  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
  setIsPwaOpen: (open) => set({ isPwaOpen: open }),
}));
