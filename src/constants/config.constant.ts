import fs from "react-native-fs";
import { _getJson } from "@services/local-storage";

export const RECAPCHA_KEY = "smRY9k7cjMACBJSeVEj6E3VgqKe858gnAmBRQQNS";
export const CACHE_MEDIA_FOLDER = fs.CachesDirectoryPath + "/media/";
export const CACHE_MEDIA_CHAT_FOLDER = fs.CachesDirectoryPath + "/media_chat/";

export enum ENVIRONMENT {
  DEVELOP = "develop",
  PRODUCT = "product",
}

// Xác định môi trường (ưu tiên DEV để test localhost)
export const isProduction =
  (_getJson("env") || (__DEV__ ? ENVIRONMENT.DEVELOP : ENVIRONMENT.PRODUCT)) ===
  ENVIRONMENT.PRODUCT;

// --------------------------------------------------------
// CẤU HÌNH DOMAIN LOCALHOST
// --------------------------------------------------------

// 1. Dùng cho iOS Simulator
const DEVELOPER_DOMAIN_DEV = "http://localhost:3900";

// 2. Dùng cho Android Emulator (Bỏ comment dòng dưới nếu chạy Android)
// const DEVELOPER_DOMAIN_DEV = "http://10.0.2.2:3900";

// 3. Dùng cho Máy thật (Thay bằng IP LAN của máy tính bạn)
// const DEVELOPER_DOMAIN_DEV = "http://192.168.1.55:3900";

// Cấu hình Socket Local
const DEVELOPER_DOMAIN_SOCKET_DEV = "http://localhost:3900"; 
// const DEVELOPER_DOMAIN_SOCKET_DEV = "http://10.0.2.2:3900"; // Cho Android

// --------------------------------------------------------
// DOMAIN PRODUCTION (Giữ nguyên)
// --------------------------------------------------------
const PRODUCTION_DOMAIN_PRODUCTION = "https://api.food.apporastudio.com";
const PRODUCTION_DOMAIN_SOCKET_PRODUCTION = "https://socket.api.ikigroup.vn";

// Logic chọn Domain
const DOMAIN = !isProduction
  ? DEVELOPER_DOMAIN_DEV
  : PRODUCTION_DOMAIN_PRODUCTION;

const DOMAIN_API = DOMAIN + "/api/"; // Kết quả: http://localhost:3900/api/

const DOMAIN_SOCKET = !isProduction
  ? DEVELOPER_DOMAIN_SOCKET_DEV
  : PRODUCTION_DOMAIN_SOCKET_PRODUCTION;

export let APP_URL = {
  APP_API_REQUEST_TIMEOUT: 15, // in second
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
    APP_API_REQUEST_TIMEOUT: 15,
    BASEURL: DOMAIN_API + "",
    BASEURL_SOCKET: DOMAIN_SOCKET + "/socket",
  };
}