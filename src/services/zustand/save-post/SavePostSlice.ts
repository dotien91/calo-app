import { StoreSlice } from "@zustand";
import { TypedRequest } from "shared/models";

export interface SavePostSlice {
  listPostSave: TypedRequest[];
  addPostSave: (item: TypedRequest) => void;
  deletePostSave: (item: TypedRequest) => void;
}

const createSavePostSlice: StoreSlice<SavePostSlice> = (set) => ({
  listPostSave: [],
  addPostSave: (item: TypedRequest) => {
    set((state) => ({
      listPostSave: [...state.listPostSave, item],
    }));
  },
  deletePostSave: (item: TypedRequest) => {
    set((state) => ({
      listPostSave: [...state.listPostSave.filter((i) => item._id !== i._id)],
    }));
  },
});

export default createSavePostSlice;
