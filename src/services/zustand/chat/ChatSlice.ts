import { StoreSlice } from "@zustand";

export interface ChatSlice {
  searchFriendTxt: string;
  setSearchFriendTxt: (searchFriendTxt: string) => void;
  viewNumber: number;
  setViewNumber: (viewNumber: number) => void;
  currentChatList: [];
  setCurrentChatList: (currentChatList: []) => void;
  currentMediaIds: [];
  setCurrentMediaIds: (currentChatList: []) => void;
  searchModeChat: boolean;
  setSearchModeChat: (searchModeChat: boolean) => void;
}

const createChatSlice: StoreSlice<ChatSlice> = (set) => ({
  searchFriendTxt: "",
  setSearchFriendTxt: (value: string) => set({ searchFriendTxt: value }),
  viewNumber: 0,
  setViewNumber: (value: number) => set({ viewNumber: value }),
  currentChatList: [],
  setCurrentChatList: (value: []) => set({ currentChatList: value }),
  currentMediaIds: [],
  setCurrentMediaIds: (value: []) => set({ currentMediaIds: value }),
  searchModeChat: false,
  setSearchModeChat: (value: boolean) => set({ searchModeChat: value }),
});

export default createChatSlice;
