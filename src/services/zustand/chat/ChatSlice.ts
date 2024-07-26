import { StoreSlice } from "@zustand";
import { TypedUser } from "models";

export interface ChatSlice {
  searchFriendTxt: string;
  setSearchFriendTxt: (searchFriendTxt: string) => void;
  viewNumber: number;
  setViewNumber: (viewNumber: number) => void;
  emojiNumber: number;
  setEmojiNumber: (emojiNumber: number) => void;
  userLive?: { user: TypedUser };
  setUserLive: (user: TypedUser) => void;
  currentChatList: [];
  setCurrentChatList: (currentChatList: []) => void;
  currentMediaIds: [];
  setCurrentMediaIds: (currentChatList: []) => void;
  searchModeChat: boolean;
  setSearchModeChat: (searchModeChat: boolean) => void;
  isMutedAll: boolean;
  setIsMutedAll: (isMutedAll: boolean) => void;
  unreadNumber: number;
  setUnreadNumber: (viewNumber: number) => void;
}

const createChatSlice: StoreSlice<ChatSlice> = (set, get) => ({
  searchFriendTxt: "",
  setSearchFriendTxt: (value: string) => set({ searchFriendTxt: value }),
  viewNumber: 0,
  setViewNumber: (value: number) => set({ viewNumber: value }),
  emojiNumber: 0,
  setEmojiNumber: (value: number) => set({ emojiNumber: value }),
  userLive: undefined,
  setUserLive: (user: TypedUser) => set({ userLive: user }),
  currentChatList: [],
  setCurrentChatList: (value: []) => set({ currentChatList: value }),
  currentMediaIds: [],
  setCurrentMediaIds: (value: []) => set({ currentMediaIds: value }),
  searchModeChat: false,
  setSearchModeChat: (value: boolean) => set({ searchModeChat: value }),
  isMutedAll: false,
  setIsMutedAll: (v) => {
    set({ isMutedAll: v });
  },
  unreadNumber: 0,
  setUnreadNumber: (value: number) => set({ unreadNumber: value }),
});

export default createChatSlice;
