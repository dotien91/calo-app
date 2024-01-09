import { EnumRole } from "constants/system.constant";

export interface IUser {
  name: string;
  email: string;
}

export interface ILoginWithSocialType {
  user_token: string;
  device_uuid: string;
  device_type: string;
}

export interface ISignUpWithEmail {
  phone_number?: string;
  full_name?: string;
  user_email: string;
  device_type: string;
  device_uuid: string;
  re_password: string;
  user_password: string;
  // "device_signature": "112667336037344462475"
}

export interface ILoginWithPass {
  phone_number?: string;
  user_email?: string;
  device_type: string;
  device_uuid: string;
  user_password: string;
  // "device_signature": "112667336037344462475"
}

export interface IRequestNewPass {
  verify_code: string;
  g_recaptcha: string;
  re_password: string;
  user_password: string;
}

export interface IVerifyCode {
  user_email: string;
  verify_code: string;
}

export interface ICreateNewPass {
  verify_code: string;
  g_recaptcha: string;
  re_password: string;
  user_password: string;
}

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
}
