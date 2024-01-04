import { StoreSlice } from "@zustand";
import { TypedUser } from "@services/models";

export interface UserSlice {
  userData: TypedUser | null;
  setUserData: (user: TypedUser) => void;
  userToken: string | null;
  setUserToken: (userToken: string) => void;
  resetUserData: () => void;
}

const createUserSlice: StoreSlice<UserSlice> = (set) => ({
  userData: null,
  setUserData: (user: TypedUser) => set({ userData: user }),
  userToken: null,
  setUserToken: (value: string) => set({ userToken: value }),
  resetUserData: () => set({ userData: null }),
});

export default createUserSlice;
