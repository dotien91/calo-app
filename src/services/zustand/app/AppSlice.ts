import { _getLang } from "@services/local-storage";
import { StoreSlice } from "@zustand";

export interface AppSlice {
  isLightMode: boolean;
  setLightMode: (value: boolean) => void;
  language: string;
  setLanguage: (language: string) => void;
  isShowWelcome: boolean;
  setShowWelcome: (value: boolean) => void;
}

const createAppSlice: StoreSlice<AppSlice> = (set) => ({
  isLightMode: false,
  setLightMode: (value: boolean) => set({ isLightMode: value }),
  language: _getLang(),
  setLanguage: (value: string) => set({ language: value }),
  isShowWelcome: true,
  setShowWelcome: (value: boolean) => set({ isShowWelcome: value }),
});

export default createAppSlice;
