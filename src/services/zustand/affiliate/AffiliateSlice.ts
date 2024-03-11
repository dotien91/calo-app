import { StoreSlice } from "@zustand";

interface DateFilterType {
  from: string;
  to: string;
}

export interface AffiliateSlice {
  dateFilter: DateFilterType;
  setDateFilter: (data: DateFilterType) => void;
  listUserSelected: string[];
  setListUserSelected: (data: string[]) => void;
  listCourseSelected: string[];
  setListCourseSelected: (data: string[]) => void;
  type: "coin" | "token";
  setType: (stringType: "coin" | "token") => void;
}

const createAffiliateSlice: StoreSlice<AffiliateSlice> = (set) => ({
  dateFilter: {
    from: "",
    to: "",
  },
  setDateFilter: (dateupdate: DateFilterType) => {
    set({
      dateFilter: dateupdate,
    });
  },
  listUserSelected: [],
  setListUserSelected: (data) => {
    set({
      listUserSelected: data,
    });
  },
  listCourseSelected: [],
  setListCourseSelected: (data) => {
    set({
      listCourseSelected: data,
    });
  },
  type: "coin",
  setType: (stringType: "coin" | "token") => {
    set({
      type: stringType,
    });
  },
});

export default createAffiliateSlice;
