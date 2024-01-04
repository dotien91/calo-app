import { StoreSlice } from "@zustand";

export interface PostSlice {
  listPostDelete: string[];
  addListPostDelete: (id: string) => void;
  resetListPostDelete: () => void;
  listCommentDelete: string[];
  addListCommentDelete: (id: string) => void;
  removeItemCommentDelete: (id: string) => void;
  resetListCommentDelete: () => void;
  listFollowing: string[];
  addFollowing: (id: string) => void;
}

const createPostSlice: StoreSlice<PostSlice> = (set) => ({
  listPostDelete: [],
  addListPostDelete: (id: string) => {
    set((state) => ({
      listPostDelete: [...state.listPostDelete, id],
    }));
  },
  resetListPostDelete: () => set({ listPostDelete: [] }),
  listCommentDelete: [],
  addListCommentDelete: (id: string) => {
    set((state) => ({
      listCommentDelete: [...state.listCommentDelete, id],
    }));
  },
  removeItemCommentDelete: (id: string) => {
    set((state) => ({
      listCommentDelete: [
        ...state.listCommentDelete.filter((item) => item !== id),
      ],
    }));
  },
  resetListCommentDelete: () => set({ listCommentDelete: [] }),
  listFollowing: [],
  addFollowing: (id: string) => {
    set((state) => ({
      listFollowing: [...state.listFollowing, id],
    }));
  },
});

export default createPostSlice;
