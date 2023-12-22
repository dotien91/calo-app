import { StoreSlice } from "@zustand";

export interface AppSlice {
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isFirstOpenApp: boolean | true;
  setIsFirstOpenApp: (value: boolean) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const createAppSlice: StoreSlice<AppSlice> = (set) => ({
  isDarkMode: false,
  setDarkMode: (value: boolean) => set({ isDarkMode: value }),
  isFirstOpenApp: false,
  setIsFirstOpenApp: (value: boolean) => set({ isFirstOpenApp: value }),
  language: "vi",
  setLanguage: (value: string) => set({ language: value }),
});

export default createAppSlice;
