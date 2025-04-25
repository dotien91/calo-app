import fs from "react-native-fs";

export const CACHE_MEDIA_FOLDER = fs.CachesDirectoryPath + "/media/";
export const CACHE_MEDIA_CHAT_FOLDER = fs.CachesDirectoryPath + "/media_chat/";

export const WEB_CLIENT_ID_GOOGLE =
  "543656532685-oh1fjl1fhvc1dcdc32agqrotf28vjj69.apps.googleusercontent.com";
export const IOS_CLIENT_ID_GOOGLE =
  "543656532685-ea3og352pgjtb382rlhmhdl983upijma.apps.googleusercontent.com";

export const HIT_SLOP_EXPAND_20 = { top: 20, left: 20, right: 20, bottom: 20 };
export const HIT_SLOP_EXPAND_10 = { top: 10, left: 10, right: 10, bottom: 10 };

export enum EnumTypeSystemSettingAction {
  Navigation,
  Switch,
  PickerSingle,
  Task,
}

export enum EnumTypeSettingOption {
  Single,
  Multi,
}

export const MESSAGE = {
  user_email_duplicated: "Email is duplicated",
  user_password_too_short: "Password must be longer than 8 characters",
  account_password_not_match: "Email or password is incorrect",
  user_not_exist: "Account does not exist",
  account_deactivated: "Account has been disabled",
};

export enum EnumTheme {
  Dark = "Dark",
  Light = "Light",
}

export enum EnumHeightWeightUnit {
  cmkg = "cm/kg",
  ftlb = "ft/lb",
}

export enum EnumDistanceUnit {
  km = "km",
  miles = "mi",
}
