import { EnumRole } from "constants/system.constant";

export interface TypedNotification {
  _id?: string;
  channel?: EnumRole;
  click_action?: string;
  content?: string;
  createdAt?: string;
  createdBy?: {
    display_name?: string;
    last_active?: string;
    user_avatar?: string;
    user_avatar_thumbnail?: string;
    user_login?: string;
    user_role: EnumRole;
    user_status?: number;
  };
  notification_type?: string;
  router?: string;
  title?: string;
  type_action?: string;
  read_status?: number | string;
  data: any;
  param: string;
  image?: string;
}
