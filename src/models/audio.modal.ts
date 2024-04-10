import { TypedMedia, TypedUser } from "shared/models";

export interface IAudioItem {
  _id: string;
  user_id: object;
  podcast_language: string;
  podcast_category: object;
  title: string;
  content: string;
  excerpt: string;
  podcast_slug: string;
  country: string;
  podcast_status: string;
  post_avatar: object;
  attach_files: any[];
  podcast_type: string;
  view_number: number;
  comment_number: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IUserAudio {
  official_status?: boolean;
  _id: string;
  user_login?: string;
  user_avatar?: string;
  user_avatar_thumbnail?: string;
  display_name?: string;
  user_role?: string;
  user_status: number;
  last_active?: string;
  user_active: number;
}

export interface TypedCategory {
  _id: string;
  user_id: TypedUser;
  category_language: string;
  category_content: string;
  category_excerpt: string;
  category_slug: string;
  category_parent: string;
  category_status: string;
  category_avatar: TypedMedia;
  category_title: string;
  category_type: string;
  category_view: number;
  seo_title: string;
  seo_description: string;
  seo_keyword: string;
  createdAt: string;
  updatedAt: string;
}

export interface TypeTrackLocal {
  _id: string;
  user_id: IUserAudio;
  podcast_language: string;
  podcast_category: TypedCategory;
  title: string;
  content: string;
  excerpt: string;
  podcast_slug: string;
  country: string;
  podcast_status: string;
  post_avatar: TypedMedia;
  attach_files: TypedMedia[];
  podcast_type: string;
  view_number: number;
  comment_number: number;
}
