import { StoreSlice } from "@zustand";

export interface NotificationSlice {
  readAllAt: string;
  setReadAllAt: (id: string) => void;
  listNotifiReaded: string[];
  addNotificationReaded: (id: string) => void;
  resetNotificationReaded: () => void;
}

const createNotificationSlice: StoreSlice<NotificationSlice> = (set) => ({
  readAllAt: "",
  setReadAllAt: (time: string) => set({ readAllAt: time }),
  listNotifiReaded: [],
  addNotificationReaded: (id: string) => {
    set((state) => {
      const index = state.listNotifiReaded.findIndex((item) => item === id);
      if (index < 0) {
        return {
          listNotifiReaded: [...state.listNotifiReaded, id],
        };
      } else {
        return {
          listNotifiReaded: [...state.listNotifiReaded],
        };
      }
    });
  },
  resetNotificationReaded: () => set({ listNotifiReaded: [] }),
});

export default createNotificationSlice;
