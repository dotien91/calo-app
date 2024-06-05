import { StoreSlice } from "@zustand";
import lodash from "lodash";
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
  updateCurrentMediaIds: (item) => {
    if (!item?.id) return;
    const { currentMediaIds } = get();
    const oldItem = currentMediaIds.find((_item) => _item?.id == item?.id) || {
      data: [],
    };
    const newItem = {
      ...item,
      data: lodash.uniqBy([...oldItem.data, ...item.data], "_id"),
    };
    set(() => ({
      currentMediaIds: [
        newItem,
        ...currentMediaIds.filter((_item) => _item?.id != item?.id),
      ],
    }));
  },
  isMutedAll: false,
  setIsMutedAll: (v) => {
    set({ isMutedAll: v });
  },
});

export default createChatSlice;
