import { StoreSlice } from "@zustand";

export interface ChatSlice {
  searchFriendTxt: string;
  setSearchFriendTxt: (searchFriendTxt: string) => void;
  viewNumber: number;
  setViewNumber: (viewNumber: number) => void;
}

const createChatSlice: StoreSlice<ChatSlice> = (set) => ({
  searchFriendTxt: "",
  setSearchFriendTxt: (value: string) => set({ searchFriendTxt: value }),
  viewNumber: 0,
  setViewNumber: (value: number) => set({ viewNumber: value }),
});

export default createChatSlice;
