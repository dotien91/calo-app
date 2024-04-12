import fs from "react-native-fs";

import { _getJson } from "@services/local-storage";
export const RECAPCHA_KEY = "smRY9k7cjMACBJSeVEj6E3VgqKe858gnAmBRQQNS";
export const CACHE_MEDIA_FOLDER = fs.CachesDirectoryPath + "/media/";
export const CACHE_MEDIA_CHAT_FOLDER = fs.CachesDirectoryPath + "/media_chat/";

export enum ENVIRONMENT {
  DEVELOP = "develop",
  PRODUCT = "product",
}

export const isProduction =
  (_getJson("env") || (__DEV__ ? ENVIRONMENT.DEVELOP : ENVIRONMENT.PRODUCT)) ===
  ENVIRONMENT.PRODUCT;

//dev domain api
// const DEVELOPER_DOMAIN_DEV = "http://192.168.1.154:3900";
const DEVELOPER_DOMAIN_DEV = "https://api.ikigai.ikigroup.vn";
const DEVELOPER_DOMAIN_SOCKET_DEV = "https://socket.api.ikigroup.vn/scoket";
// const UPLOAD_URL = "https://media.exam24h.com/";

//prod domain api
const PRODUCTION_DOMAIN_PRODUCTION = "https://api.ikigai.ikigroup.vn";
const PRODUCTION_DOMAIN_SOCKET_PRODUCTION =
  "https://socket.api.ikigroup.vn/scoket";

const DOMAIN = !isProduction
  ? DEVELOPER_DOMAIN_DEV
  : PRODUCTION_DOMAIN_PRODUCTION;
const DOMAIN_API = DOMAIN + "/api/";
const DOMAIN_SOCKET = !isProduction
  ? DEVELOPER_DOMAIN_SOCKET_DEV
  : PRODUCTION_DOMAIN_SOCKET_PRODUCTION;

export let APP_URL = {
  APP_API_REQUEST_TIMEOUT: 15, // in second, NOT microseconds
  BASEURL: DOMAIN_API + "",
  BASEURL_SOCKET: DOMAIN_SOCKET + "/socket",
};

export function setUrlEnv(isProduction: boolean) {
  const DOMAIN = !isProduction
    ? DEVELOPER_DOMAIN_DEV
    : PRODUCTION_DOMAIN_PRODUCTION;
  const DOMAIN_API = DOMAIN + "/api/";
  const DOMAIN_SOCKET = !isProduction
    ? DEVELOPER_DOMAIN_SOCKET_DEV
    : PRODUCTION_DOMAIN_SOCKET_PRODUCTION;
  APP_URL = {
    APP_API_REQUEST_TIMEOUT: 15, // in second, NOT microseconds
    BASEURL: DOMAIN_API + "",
    BASEURL_SOCKET: DOMAIN_SOCKET + "/socket",
  };
}
