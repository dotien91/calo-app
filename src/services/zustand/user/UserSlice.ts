import { StoreSlice } from "@zustand";
import { TypedUser } from "models";

export interface UserSlice {
  userData: TypedUser | null;
  setUserData: (user: TypedUser) => void;
  userToken: string | null;
  setUserToken: (userToken: string) => void;
  resetUserData: () => void;
  listFollow: string[];
  updateListFollow: (id: string) => void;
  initListFollow: (data: string[]) => void;
  linkAvatar: string;
  setLinkAvatar: (link: string) => void;
  userInfo: TypedUser | null;
  setUserInfo: (user: TypedUser) => void;
}

const createUserSlice: StoreSlice<UserSlice> = (set) => ({
  userData: null,
  setUserData: (user: TypedUser) => set({ userData: user }),
  userInfo: null,
  setUserInfo: (user: TypedUser) => set({ userInfo: user }),
  userToken: null,
  setUserToken: (value: string) => set({ userToken: value }),
  resetUserData: () => set({ userData: null }),
  listFollow: [],
  initListFollow: (data: string[]) => {
    set({ listFollow: data });
  },
  updateListFollow: (_id) => {
    set((state) => {
      const index = state.listFollow.findIndex((item) => item === _id);
      if (index >= 0) {
        return {
          listFollow: [...state.listFollow.filter((item) => item !== id)],
        };
      } else {
        return {
          listFollow: [...state.listFollow, _id],
        };
      }
    });
  },
  linkAvatar: "",
  setLinkAvatar: (link) => {
    set({ linkAvatar: link });
  },
});

export default createUserSlice;
