import { StoreSlice } from "@zustand";
import { TypedUser } from "models";

interface IUserMedia {
  user_avatar?: string;
  user_cover?: string;
}

export interface IGiftDonate {
  key: string;
  image: string;
  des: string;
  value: number;
}

export interface IAffiliate {
  AFFILIATE_COMMISSION?: number;
  REFERALL_COMMISSION?: number;
  TEACHER_SHARE?: number;
  PAYMENT_FEE?: number;
  NET_REVENUE?: number;
}

export interface UserSlice {
  userData: TypedUser | null;
  setUserData: (user: TypedUser) => void;
  userToken: string | null;
  setUserToken: (userToken: string) => void;
  resetUserData: () => void;
  listFollow: string[];
  updateListFollow: (id: string) => void;
  listBlock: any[];
  updateListBlock: (id: string) => void;
  initListFollow: (data: string[]) => void;
  linkAvatar: string;
  setLinkAvatar: (link: string) => void;
  userMedia: IUserMedia;
  setUserMedia: (v: IUserMedia) => void;
  userInfo: TypedUser | null;
  setUserInfo: (user: TypedUser) => void;
  showInvite: boolean;
  setShowInvite: (bol: boolean) => void;
  isSendEliteClub: boolean;
  setIsSendEliteClub: (bol: boolean) => void;
  codeInvite: string;
  setCodeInvite: (str: string) => void;
  extraUserData: any;
  setExtraUserData: (data: any) => void;
  listGift: IGiftDonate[];
  setListGift: (data: IGiftDonate[]) => void;
  affiliate: IAffiliate;
  setAffiliate: (data: IAffiliate) => void;
  typeCallGroup: string;
  setTypeCallGroup: (data: string) => void;
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
  listBlock: [],
  updateListBlock: (data) => {
    set({ listBlock: data });
  },
  linkAvatar: "",
  setLinkAvatar: (link) => {
    set({ linkAvatar: link });
  },
  showInvite: true,
  setShowInvite: (bol) => {
    set({ showInvite: bol });
  },
  userMedia: {
    user_avatar: "",
    user_cover: "",
  },
  setUserMedia: (v: IUserMedia) => {
    set((state) => {
      return { userMedia: { ...state.userMedia, ...v } };
    });
  },
  isSendEliteClub: false,
  setIsSendEliteClub: (bol: boolean) => {
    set({ isSendEliteClub: bol });
  },
  codeInvite: "",
  setCodeInvite: (str: string) => {
    set({ codeInvite: str });
  },
  extraUserData: null,
  setExtraUserData: (data: any) => {
    set((state) => {
      return { extraUserData: { ...state.extraUserData, ...data } };
    });
  },
  listGift: [],
  setListGift: (data: IGiftDonate[]) => {
    set({ listGift: data });
  },
  affiliate: {},
  setAffiliate: (data: IAffiliate) => {
    set({ affiliate: data });
  },
  typeCallGroup: "",
  setTypeCallGroup: (data: string) => {
    set({ typeCallGroup: data });
  },
});

export default createUserSlice;
