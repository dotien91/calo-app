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
