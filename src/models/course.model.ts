import { TypedMedia, TypedUser } from "shared/models";

export interface ICourseItem {
  _id: string;
  user_id: TypedUser;
  title: string;
  description: string;
  long_description: string;
  avatar: TypedMedia;
  service_id: string;
  plan_id: string;
  media_id: TypedMedia;
  start_time: string;
  end_time: string;
  slug: string;
  language: string;
  country: string;
  version: string;
  product_id: string;
  public_status: string;
  subscribe: string;
  trash_status: string;
  rating: number;
  price: number;
  video_count: number;
  post_count: number;
  join_number: number;
  news_count: number;
  doc_count: number;
  module_count: number;
  module_child_count: number;
  hashtag_id: any[];
}

export interface IListCourseFilterParams {
  limit: number;
  search?: string;
}
// const courseFilterKeysDefault = {
//   levels: ["4+", "5+", "6+", "7+", "8+", "9"],
//   skills: ["All skills", "Listening", "Reading", "Writing", "Speaking"],
//   types: ["All forms", "Call 1-1", "Self-learning", "Call group"],
//   price: "slider",
//   onlyEnglishNativeSpeakers: "checkbox",
// };
export interface ICourseFilterKeys {
  levels: string[];
  skills: string[];
  types: string[];
  price: string;
  onlyEnglishNativeSpeakers: string;
}

export enum EnumCourseType {
  course = "course",
  tutor = "tutor",
}

export enum EnumCourseFilter {
  types = "types",
  skills = "skills",
  price = "price",
  levels = "levels",
  onlyEnglishNativeSpeakers = "onlyEnglishNativeSpeakers",
}

export enum EnumTutorFilter {
  types = "types",
  skills = "skills",
  price = "price",
  onlyEnglishNativeSpeakers = "onlyEnglishNativeSpeakers",
  timeAvailable = "timeAvailable",
  levelOfTutor = "levelOfTutor",
}

export interface IClass {
  bio: string;
  certificates: string;
  country: string;
  createdAt: string;
  description: string;
  display_name: string;
  educations: string;
  rating: string;
  tutor_level: string;
  user_avatar_thumbnail: string;
  _id: string;
}
