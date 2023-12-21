import { StoreSlice } from "@zustand";

export interface AppSlice {
  isWalkthroughAvailable: boolean;
  setWalkthrough: (value: boolean) => void;
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const createAppSlice: StoreSlice<AppSlice> = (set) => ({
  isWalkthroughAvailable: true,
  setWalkthrough: (value: boolean) => set({ isWalkthroughAvailable: value }),
  isDarkMode: false,
  setDarkMode: (value: boolean) => set({ isDarkMode: value }),
  language: "vi",
  setLanguage: (value: string) => set({ language: value }),
});

export default createAppSlice;
