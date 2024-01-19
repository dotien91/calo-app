import { StoreSlice } from "@zustand";
import { TypedPost } from "shared/models";

export interface SavePostSlice {
  listPostSave: TypedPost[];
  addPostSave: (item: TypedPost) => void;
  deletePostSave: (item: TypedPost) => void;
}

const createSavePostSlice: StoreSlice<SavePostSlice> = (set) => ({
  listPostSave: [],
  addPostSave: (item: TypedPost) => {
    set((state) => ({
      listPostSave: [...state.listPostSave, item],
    }));
  },
  deletePostSave: (item: TypedPost) => {
    set((state) => ({
      listPostSave: [...state.listPostSave.filter((i) => item._id !== i._id)],
    }));
  },
});

export default createSavePostSlice;
