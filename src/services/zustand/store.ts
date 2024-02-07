import create, { StoreApi } from "zustand";
import { LocalStorage } from "@local-storage";
import createAppSlice, { AppSlice } from "@services/zustand/app/AppSlice";
import createUserSlice, { UserSlice } from "@services/zustand/user/UserSlice";
import createChatSlice, { ChatSlice } from "@services/zustand/chat/ChatSlice";
import createPostSlice, { PostSlice } from "@services/zustand/post/PostSlice";
import createCourseSlice, {
  CourseSlice,
} from "@services/zustand/course/CourseSlice";

import createNotificationSlice, {
  NotificationSlice,
} from "@services/zustand/notification/NotificationSlice";
import createSavePostSlice, {
  SavePostSlice,
} from "@services/zustand/save-post/SavePostSlice";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

export type StoreState = AppSlice &
  UserSlice &
  PostSlice &
  ChatSlice &
  CourseSlice &
  SavePostSlice &
  NotificationSlice;
export type StoreSlice<T> = (
  set: StoreApi<StoreState>["setState"],
  get: StoreApi<StoreState>["getState"],
) => T;

const ZustandMMKVStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    return LocalStorage.set(name, value);
  },
  getItem: (name: string) => {
    const value = LocalStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return LocalStorage.delete(name);
  },
};

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...createAppSlice(set, get),
      ...createUserSlice(set, get),
      ...createChatSlice(set, get),
      ...createPostSlice(set, get),
      ...createSavePostSlice(set, get),
      ...createCourseSlice(set, get),
      ...createNotificationSlice(set, get),
    }),
    {
      name: "store",
      storage: createJSONStorage(() => ZustandMMKVStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              ![
                "searchFriendTxt",
                "listPostDelete",
                // "currentMediaIds",
                "currentChatList",
                "courseFilterKeys",
                "listCourseFilterParams",
                "courseCurrentSort",
                "courseCurrentType",
                "courseSearchHistory",
              ].includes(key),
          ),
        ),
    },
  ),
);

export default useStore;
