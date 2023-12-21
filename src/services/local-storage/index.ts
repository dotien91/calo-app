import { MMKV } from "react-native-mmkv";

export const LocalStorage = new MMKV();

export const TOKEN = "Token";

export const _getJson = (key: string) => {
  const data: string = LocalStorage.getString(key) || "";
  return !data ? {} : JSON.parse(data);
};

export const _setJson = (key: string, value: any) => {
  LocalStorage.set(key, JSON.stringify(value));
};
