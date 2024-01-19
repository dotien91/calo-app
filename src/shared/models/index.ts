import { EnumRole } from "shared/constants/system.constant";
import { TypedRoomLiveStream } from "./livestream.model";

export interface TypedUser {
  _id?: string;
  user_phone?: string;
  user_address?: string;
  user_birthday?: string;
  user_birthday_year?: number;
  base_height?: number;
  base_weight?: number;
  base_role?: string;
  body_type?: string;
  relationship_status?: string;
  ethnicity?: string;
  loc?: any;
  social_link?: { key: string; value: string }[];
  createdAt?: string;
  updatedAt?: string;
  user_login?: string;
  user_avatar?: string;
  user_cover?: string;
  display_name?: string;
  user_role?: EnumRole;
  bio?: string;
  user_referrer?: string;
  user_balance?: number;
  user_status?: number;
  last_active?: string;
  user_active?: number;
  follow_id?: any;
  user_id?: string;
  user_avatar_thumbnail?: string;
  map_count?: string;
  distance?: number;
  match_status?: number;
  is_block?: number;
  user_number?: number;
  travel_city?: string | null;
  instagram_token?: string;
  notification_status?: string;
  user_interest?: string[];
  circle_point?: number;
  is_avatar?: number;
  validate_status?: number;
  disable_account?: string;
  user_mood?: {
    image: string;
    text: string;
  };
  message_stranger?: string;
  country?: string;
  video_number?: number;
  user_education?: string;
  user_religion?: string;
  like_alcoholic?: string;
  like_tobacco?: string;
  have_children?: string;
  living_with?: string;
  user_level?: number;
  description?: string;
  level_number?: number;
  channel_role?: string;
  permission?: any;
  notification_course?: "1" | "0";
  notification_user?: "1" | "0";
  notification_community?: "1" | "0";
  notification_chat?: "1" | "0";
  user_password?: string;
  user_email?: string;
  is_follow?: boolean;
  is_validate_phone?: boolean;
  is_verify_email?: boolean;
  official_status?: boolean;
}

export interface TypedPlan {
  amount_of_day: number;
  country: string;
  createdAt: string;
  description: string;
  google_store_product_id: string;
  handle: string;
  handle_id: string;
  image: string;
  name: string;
  price: number;
  status: number;
  type: string;
  updatedAt: string;
  version: string;
  currency: string;
  _id: string;
}

export interface TypedSubscribed {
  transaction_id: string;
  transaction_value: number;
  transaction_ref?: string;
  transaction_note?: string;
  transaction_condition: string;
  transaction_current_balance: number;
  transaction_new_balance: number;
  // transaction_method: TRANSACTION_METHOD;
  object_id?: string;
  createAt: string;
  updateAt?: string;
  service_name?: string;
  service_id?: {
    _id: string;
    title: string;
  };
  _id: string;
  end_at: string;
}

export interface TypedLoginWithGoogleAccount {
  user_token: string | null;
  device_uuid?: string;
  device_type?: string;
  device_signature?: string;
  full_name?: string;
  language?: string;
}

export interface TypedLoginWithPassword {
  user_email: string;
  user_password: string;
  device_uuid?: string;
  device_type?: string;
  device_signature?: string;
  full_name?: string;
  g_recaptcha?: string;
  language?: string;
}

export interface TypedLoginWithFacebookAccount {
  user_token: string;
  device_uuid?: string;
  device_type?: string;
  device_signature?: string;
  language?: string;
}

export interface TypedGroup {
  _id: string;
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

export interface TypedMedia {
  _id: string;
  media_url: string;
  media_url_presign: string;
  media_type: string;
  media_thumbnail: string;
  media_square: string;
  media_mime_type: string;
  media_file_name: string;
  chat_history_id: any;
  chat_room_id: any;
  media_status: number;
  gender: string;
  sexual_content: number;
  data_ai: string;
  media_meta: any;
  createBy: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  url: string;
}

export interface TypedRequest {
  _id: string;
  user_id: TypedUser;
  post_language: string;
  post_category?: TypedCategory;
  post_title: string;
  post_content: string;
  post_excerpt: string;
  post_slug: string;
  post_status: string;
  post_avatar: TypedMedia;
  attach_files: TypedMedia[];
  post_information: string;
  post_type: string;
  view_number: number;
  like_number: number;
  dislike_number: number;
  comment_number: number;
  vote_number: number;
  createdAt: string;
  updatedAt: string;
  is_like: boolean;
  is_dislike: boolean;
  is_notification: boolean;
  is_pin: number;
  is_comment: number;
  poll_ids: TypedPoll[];
  data_json?: string;
  data_json_type?: "livestream" | "challenge" | "gift" | "course" | "event";
  type?: "update" | "like";
}

export interface TypedPoll {
  createAt: string;
  created_by: string;
  number_choose: number;
  question: string;
  request_id: string;
  updatedAt: string;
  _id: string;
  users_choose: TypedUser[];
}

export interface TypedCropImage {
  creationDate?: string;
  cropRect?: any;
  data?: any;
  duration?: any;
  exif?: any;
  filename?: string;
  fileName?: string;
  height?: number;
  localIdentifier?: string;
  mime?: string;
  modificationDate?: any;
  path?: string;
  size?: number;
  sourceURL?: string;
  width?: number;
  type?: string;
  uri?: string;
}

export interface TypedComment {
  _id?: string;
  user_id?: TypedUser;
  request_id?: string;
  content?: string;
  parent_id?: any;
  createdAt?: string;
  updatedAt?: string;
  child?: TypedComment[];
  child_number?: number;
  vote_number?: number;
  like_number?: number;
  is_like?: boolean;
  is_dislike?: boolean;
  local_id?: string;
  sending?: boolean;
  community_id?: string;
}

export interface TypedCourse {
  avatar: TypedMedia;
  country: string;
  createdAt: string;
  description: string;
  doc_count: string;
  end_time: any;
  hashtag_id: any[];
  language: string;
  media_id: any;
  news_count: string;
  post_count: string;
  product_id: string;
  public_status: string;
  rating: number;
  slug: string;
  start_time: any;
  subscribe: string;
  title: string;
  trash_status: string;
  updatedAt: string;
  user_id: TypedUser;
  version: string;
  video_count: any;
  _id: string;
  short_description: string;
  level_value: number;
  long_description: string;
  coin_value: number;
  is_join: boolean;
}

export interface TypedModule {
  course_id: string;
  createdAt: string;
  title: string;
  updatedAt: string;
  user_id: TypedUser;
  _id: string;
  parent_id: string;
  media_id: TypedMedia;
  is_view: boolean;
}

export interface TypedChannel {
  admin_number: number;
  admin_user: TypedUser[];
  attach_files: TypedMedia[];
  avatar: TypedMedia;
  cover: any;
  createdAt: string;
  description: string;
  domain: string;
  hashtag_id: any[];
  member_number: number;
  name: string;
  official_status: number;
  public_status: string;
  short_description: string;
  sub_domain: string;
  updatedAt: string;
  user_id: TypedUser;
  _id: string;
  point_data: {
    key: string;
    value: string;
    error?: boolean;
    description?: string;
  }[];
  mentor_commission: string;
  user_commission: string;
  need_approval: boolean;
  data_config: string;
  service_id: TypedServiceChannel[];
}

export interface TypedUserChannel {
  _id: string;
  channel_id: TypedChannel;
  channel_level: TypedChannelLevel;
  channel_role: EnumRole;
  createdAt: string;
  level_number: number;
  permission: string[];
  coin_number: number;
  point: number;
  point_month: number;
  point_week: number;
  updatedAt: string;
  user_id: TypedUser;
  is_follow: boolean;
  official_status: string;
  service_id: TypedServiceChannel[];
}

export interface TypedServiceChannel {
  avatar: TypedMedia;
  createdAt: string;
  description: string;
  handle: string;
  icon_side_bar: string;
  install_number: number;
  is_show_side_bar: true;
  long_description: string;
  review_number: number;
  review_value: number;
  router_link: string;
  service_type: string;
  title: string;
  title_side_bar: string;
  updatedAt: string;
  user_id: string;
  _id: string;
}

export interface TypedChannelLevel {
  channel_id: string;
  createdAt: string;
  level_number: number;
  title: string;
  updatedAt: string;
  user_id: TypedUser;
  level_point: number;
  _id: string;
}

export interface TypedLevel {
  _id: string;
  user_id: string;
  channel_id: string;
  createdAt: string;
  level_number: number;
  title: string;
  updatedAt: string;
  total_member: number;
  level_point: number;
}

export interface TypedEvent {
  address: { key: string; value: string }[];
  address_full: string;
  category: any[];
  createdAt: string;
  description: string;
  distance: number;
  duration: number;
  end_date: any;
  end_occurrences: number;
  interested: any[];
  interested_number: string;
  is_like: boolean;
  is_recurring: number;
  is_remind: number;
  like: any[];
  like_number: number;
  open_date: string;
  open_ticket_date: any;
  permission: string;
  pre_order_date: any;
  public_album: TypedMedia[];
  rating_number: number;
  rating_value: number;
  repeat_every: number;
  repeat_on: string[];
  title: string;
  type: null;
  updatedAt: string;
  _id: string;
  event_time: { event_id: string; event_date: string }[];
  day?: string;
  event_id?: TypedEvent;
  event_level?: string;
  event_course?: TypedCourse;
  user_id?: TypedUser;
  livestream_id?: TypedRoomLiveStream;
}

export interface TypedCreateEvent {
  _id?: string;
  title: string;
  description?: string;
  hash_tag?: string;
  country?: string;
  language?: string;
  city?: string;
  address?: string;
  public_album: string;
  category?: string;
  type?: string;
  open_date: string;
  end_date?: string;
  open_ticket_date?: string;
  pre_order_date?: string;
  permission: string;
  repeat_on?: string;
  is_remind?: string;
  repeat_every?: string;
  is_recurring?: string;
  duration: string;
  end_occurrences?: string;
}

export interface TypedFollowUser {
  _id?: string;
  createdAt?: string;
  is_follow: boolean;
  match_status: number;
  updatedAt: string;
  user_id: string;
  partner_id: TypedUser;
}

export interface TypedUserLiked {
  _id?: string;
  createdAt?: string;
  is_follow: boolean;
  request_id: string;
  updatedAt: string;
  user_id: TypedUser;
}
