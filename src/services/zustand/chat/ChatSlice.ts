import { StoreSlice } from "@zustand";

export interface ChatSlice {
  searchFriendTxt: string;
  setSearchFriendTxt: (searchFriendTxt: string) => void;
}

const createChatSlice: StoreSlice<ChatSlice> = (set) => ({
  searchFriendTxt: "",
  setSearchFriendTxt: (value: string) => set({ searchFriendTxt: value }),
});

export default createChatSlice;
