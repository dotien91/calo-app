import axios, { AxiosRequestConfig } from "axios";
import lodash from "lodash";
// eslint-disable-next-line import/no-extraneous-dependencies
import { APP_URL } from "constants/config.constant";
import { USER_TOKEN, _getJson } from "@services/local-storage";

// export const BASEURL = "https://api.edu-like.exam24h.com/api/";
export const BASEURL = APP_URL.BASEURL;
export const UPLOAD_URL = "https://media.exam24h.com/";

export const METHOD = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

const headersDefault = {
  "Content-Type": "application/json",
  Accept: "application/json, text/plain, */*",
};

interface RequestOption extends AxiosRequestConfig {
  requestTime?: number;
  retry?: boolean;
}

export const apiClient = axios.create({
  timeout: 20000,
  headers: headersDefault,
});

// Add a request interceptor
apiClient.interceptors.request.use(
  function (config) {
    const userToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjQ5MDc2NzcsImRhdGEiOnsiX2lkIjoiNjc0MDAwMjEyY2VjMzA4YjkxNWUxZjJmIiwia2V5IjoiNGYxZmNiMWEyNDU2ZmJkNjY4MDA1YTUyYWUyMmU4YjYiLCJzaWduYXR1cmUiOiJkNTY4NGVjMTZkOTBhNjE4MWJlMjliYWMyNGVlODQ2MiIsInNlc3Npb24iOiI2NzUxMjcxZDVhOTlhZTE3YmNiYTM0YTUifSwiaWF0IjoxNzMzMzcxNjc3fQ.voxL4PjiB5jbCfxI9Gh1vDT84s7qxEgwW4Mw8bZY5ro";
    // const userToken =
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDcxMDMxMzMsImRhdGEiOnsiX2lkIjoiNjYxNzkxOTk1MmM2ODE5MTY2ODdlMzJlIiwia2V5IjoiYjM4MTgzODdiM2U3YmRjOTNiNDg1ZTU4ZGM4ZjA4YzIiLCJzaWduYXR1cmUiOiIwN2E1YWY4YzhkYmRkZWRmMTE2OWE0MTA4MDlmNTIwZCIsInNlc3Npb24iOiI2NjQxN2ExZDkyODE2OGY0YmEyOGE0NjQifSwiaWF0IjoxNzE1NTY3MTMzfQ.HZ26Wto9VAYMd4pTb6svh5Q59PPGTInemjZ1anDmnvk";
    if (userToken) config.headers["X-Authorization"] = userToken;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject({ ...error, isError: true });
  },
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("error interceptors", error);
    let message: string = error?.response?.data?.message;
    if (lodash.isArray(message)) {
      message = error?.response?.data?.message?.[0] || "";
    }
    return Promise.reject({ ...error, message, isError: true });
  },
);

interface IRequest {
  url?: string;
  urlPath?: string;
  params?: any;
  data?: any;
  method?: string;
  option?: RequestOption;
  customHeader?: Headers;
  onUploadProgress?: any;
  timeOut?: number;
}

export default function request({
  params,
  url,
  urlPath,
  data,
  method,
  option,
  customHeader,
  onUploadProgress,
  timeOut = 20000,
}: IRequest) {
  return apiClient
    .request({
      method: method || METHOD.POST,
      url: url || BASEURL + urlPath,
      params,
      data,
      ...option,
      headers: customHeader || headersDefault,
      timeout: timeOut,
      onUploadProgress: onUploadProgress ? onUploadProgress : () => {},
    })
    .catch((error) => {
      return Promise.resolve({ ...error, isError: true });
    });
}
