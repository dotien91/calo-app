import { StoreSlice } from "@zustand";
import { IUser } from "@services/models";

export interface UserSlice {
  userData: IUser | null;
  setUserData: (user: IUser) => void;
  userToken: string | null;
  setUserToken: (userToken: string) => void;
  resetUserData: () => void;
}

const createUserSlice: StoreSlice<UserSlice> = (set) => ({
  userData: null,
  setUserData: (user: IUser) => set({ userData: user }),
  userToken: null,
  setUserToken: (value: string) => set({ userToken: value }),
  resetUserData: () => set({ userData: null }),
});

export default createUserSlice;
