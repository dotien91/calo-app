import { _getLang } from "@services/local-storage";
import { StoreSlice } from "@zustand";

export interface AppSlice {
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: string;
  setLanguage: (language: string) => void;
  isShowWelcome: boolean;
  setShowWelcome: (value: boolean) => void;
}

const createAppSlice: StoreSlice<AppSlice> = (set) => ({
  isDarkMode: true,
  setDarkMode: (value: boolean) => set({ isDarkMode: value }),
  language: _getLang(),
  setLanguage: (value: string) => set({ language: value }),
  isShowWelcome: true,
  setShowWelcome: (value: boolean) => set({ isShowWelcome: value }),
});

export default createAppSlice;
