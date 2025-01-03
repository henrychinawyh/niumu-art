import { create, StoreApi, UseBoundStore } from 'zustand';

interface StoreState {
  messages: any[];
  currentChatId: number | null;
  setCurrentChatId: (id: number) => void;
  setMessages: (messages: any[]) => void;
}

export const useStore: UseBoundStore<StoreApi<StoreState>> = create((set) => ({
  messages: [], // 对话框数据
  currentChatId: null,

  setCurrentChatId: (id: number) => set({ currentChatId: id }),
  setMessages: (messages: any[]) => set({ messages }),
}));
