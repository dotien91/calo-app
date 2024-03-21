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
  listLike: { _id: string; numberLike: number; isLike: boolean }[];
  updateListLike: (_id: string, numberLike: number, isLike: boolean) => void;
  listCountComments: { _id: string; numberComments: number }[];
  updateListCountComments: (_id: string, numberComments: number) => void;
  clearListCountComments: () => void;
  resetListLike: () => void;
  itemUpdate: any;
  setItemUpdate: (data: any) => void;
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
  listLike: [],
  updateListLike: (_id: string, numberLike: number, isLike: boolean) => {
    set((state) => {
      const index = state.listLike.findIndex((item) => item._id === _id);
      if (index >= 0) {
        const listLike = [...state.listLike];
        listLike[index] = { _id: _id, numberLike: numberLike, isLike: isLike };
        return {
          listLike: listLike,
        };
      } else {
        return {
          listLike: [
            ...state.listLike,
            { _id: _id, numberLike: numberLike, isLike: isLike },
          ],
        };
      }
    });
  },
  resetListLike: () => set({ listLike: [] }),
  itemUpdate: {},
  setItemUpdate: (item: any) => {
    set({ itemUpdate: item });
  },
  listCountComments: [],
  updateListCountComments: (_id: string, numberComments: number) => {
    set((state) => {
      const index = state.listCountComments.findIndex(
        (item) => item._id === _id,
      );
      if (index >= 0) {
        const listCountComments = [...state.listCountComments];
        listCountComments[index] = { _id: _id, numberComments: numberComments };
        return {
          listCountComments: listCountComments,
        };
      } else {
        return {
          listCountComments: [
            ...state.listCountComments,
            { _id: _id, numberComments: numberComments },
          ],
        };
      }
    });
  },
  clearListCountComments: () => set({ listCountComments: [] }),
});

export default createPostSlice;
