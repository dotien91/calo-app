import { StoreSlice } from "@zustand";
import {
  IListCourseFilterParams,
  ICourseFilterKeys,
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
}

const createCourseSlice: StoreSlice<CourseSlice> = (set) => ({
  listCourseFilterParams: { limit: "999999999" },
  setListCourseFilterParams: (params: IListCourseFilterParams) =>
    set({ listCourseFilterParams: params }),
  courseFilterKeys: courseFilterKeysDefault,
  setCourseFilterKeys: (v: ICourseFilterKeys) => set({ courseFilterKeys: v }),
  courseCurrentSort: { id: "", name: "" },
  setCourseCurrentSort: (v: ICurrentSort) => set({ courseCurrentSort: v }),
  courseCurrentType: { id: "course", name: "Course" },
  setCourseCurrentType: (v: ICurrentSort) => set({ courseCurrentType: v }),
  courseSearchHistory: "",
  setCourseSearchHistory: (v: string) => set({ courseSearchHistory: v }),
});

export default createCourseSlice;
