import { StoreSlice } from "@zustand";
import {
  IListCourseFilterParams,
  ICourseFilterKeys,
  ICourseItem,
} from "models/course.model";

const courseFilterKeysDefault = {
  levels: ["4+", "5+", "6+", "7+", "8+", "9"],
  skills: ["All skills", "Listening", "Reading", "Writing", "Speaking"],
  types: ["All forms", "Call 1-1", "Self-learning", "Call group"],
  price: "slider",
  onlyEnglishNativeSpeakers: "checkbox",
};

interface ICurrentSort {
  id: string;
  name: string;
}
export interface CourseSlice {
  fileCourseLocal: { id: string; localFile: string }[];
  addFileCourseLocal: (id: string, localFile: string) => void;

  listFavourites: string[];
  addToFavourites: (id: string) => void;
}

interface IWatchingVideo {
  id: string;
  progress: number;
  url: string;
}

interface IProgressLearningItem {
  id: string;
  module_child_count: number;
  module_view_count: number;
}

export interface CourseSlice {
  listCourseFilterParams: IListCourseFilterParams;
  setListCourseFilterParams: (params: IListCourseFilterParams) => void;
  courseFilterKeys: ICourseFilterKeys;
  setCourseFilterKeys: (params: ICourseFilterKeys) => void;
  courseCurrentSort: ICurrentSort;
  setCourseCurrentSort: (params: ICurrentSort) => void;
  courseCurrentType: ICurrentSort;
  setCourseCurrentType: (params: ICurrentSort) => void;
  courseSearchHistory: string;
  setCourseSearchHistory: (v: string) => void;
  fileCourseLocal: { id: string; localFile: string }[];
  addFileCourseLocal: (id: string, localFile: string) => void;

  listFavourites: string[];
  addToFavourites: (id: string) => void;
  listParticipants: any[];
  setListParticipants: (v: any[]) => void;
  watchingVideos: IWatchingVideo[];
  _progressLearningData: IProgressLearningItem[];
  listVideoCourse: [];
  setListVideoCourse: [];
  shoppingProduct: ICourseItem;
  setShoppingProduct: (v: ICourseItem) => void;
  currentMemberVideoRoom: [];
  setCurrentMemberVideoRoom: (v: any) => void;
}

const createCourseSlice: StoreSlice<CourseSlice> = (set, get) => ({
  listCourseFilterParams: { limit: "999999999", public_status: "active" },
  setListCourseFilterParams: (params: IListCourseFilterParams) =>
    set({ listCourseFilterParams: { ...params, public_status: "active" } }),
  courseFilterKeys: courseFilterKeysDefault,
  setCourseFilterKeys: (v: ICourseFilterKeys) => set({ courseFilterKeys: v }),
  courseCurrentSort: { id: "", name: "" },
  setCourseCurrentSort: (v: ICurrentSort) => set({ courseCurrentSort: v }),
  courseCurrentType: { id: "course", name: "Course" },
  setCourseCurrentType: (v: ICurrentSort) => set({ courseCurrentType: v }),
  courseSearchHistory: "",
  setCourseSearchHistory: (v: string) => set({ courseSearchHistory: v }),
  fileCourseLocal: [],
  addFileCourseLocal: (id: string, localFile: string) => {
    set((state) => {
      const index = state.fileCourseLocal.findIndex((item) => item.id === id);
      if (index < 0) {
        return {
          fileCourseLocal: [
            ...state.fileCourseLocal,
            { id: id, localFile: localFile },
          ],
        };
      } else {
        return {
          fileCourseLocal: [...state.fileCourseLocal],
        };
      }
    });
  },

  listFavourites: [],
  addToFavourites: (id: string) => {
    set((state) => {
      const index = state.listFavourites.findIndex((item) => item === id);
      if (index < 0) {
        return {
          listFavourites: [...state.listFavourites, id],
        };
      } else {
        return {
          listFavourites: [...state.listFavourites.map((item) => item !== id)],
        };
      }
    });
  },
  listParticipants: [],
  setListParticipants: (v: any[]) => set({ listParticipants: v }),
  updateListParticipants: (id, method) => {
    const { listParticipants } = get();
    let newList = [];
    if (method == "add") {
      newList = [...listParticipants, id];
    }
    if (method == "delete") {
      newList = listParticipants.filter((item) => item != id);
    }
    set(() => ({
      listParticipants: newList,
    }));
  },
  watchingVideos: [],
  updateWatchingVideos: (data: IWatchingVideo) => {
    const { watchingVideos } = get();
    console.log("set. =====watchingVideos", {
      watchingVideos,
      data,
    });
    set(() => ({
      watchingVideos: [
        data,
        ...watchingVideos.filter((_item) => _item.id != data.id),
      ],
    }));
  },
  _progressLearningData: [],
  _updateProgressLearningData: (data: IProgressLearningItem) => {
    const { _progressLearningData } = get();
    set(() => ({
      _progressLearningData: [
        data,
        ..._progressLearningData.filter((_item) => _item.id != data.id),
      ],
    }));
  },
  listVideoCourse: [],
  setListVideoCourse: (v) => set({ listVideoCourse: v }),
  shoppingProduct: null,
  setShoppingProduct: (v) => set({ shoppingProduct: v }),
  currentMemberVideoRoom: [],
  setCurrentMemberVideoRoom: (v) => set({ currentMemberVideoRoom: v }),
});

export default createCourseSlice;
