import { translations } from "@localization";
import { MMKV } from "react-native-mmkv";

export const LocalStorage = new MMKV();

export const USER_TOKEN = "userToken";
export const LANG = "language";
export const HAS_COMPLETED_ONBOARDING = "has_completed_onboarding";

export const _getJson = (key: string) => {
  const data: string = LocalStorage.getString(key) || "";
  return !data ? null : JSON.parse(data);
};

export const _getLang = () => {
  const lang = _getJson(LANG) || "en";
  translations.setLanguage(lang);
  return lang;
};

export const _setJson = (key: string, value: any) => {
  LocalStorage.set(key, JSON.stringify(value));
};
