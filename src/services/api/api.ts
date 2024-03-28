import axios, { AxiosRequestConfig } from "axios";
import lodash from "lodash";
// eslint-disable-next-line import/no-extraneous-dependencies
import { _getJson, USER_TOKEN } from "@services/local-storage";
import { APP_URL } from "constants/config.constant";

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
    const userToken = _getJson(USER_TOKEN);
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
    console.log("error interceptors", { error, url: error?.config?.url });
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
}

export default function request({
  params,
  url,
  urlPath,
  data,
  method,
  option,
  customHeader,
}: IRequest) {
  return apiClient
    .request({
      method: method || METHOD.POST,
      url: url || BASEURL + urlPath,
      params,
      data,
      ...option,
      headers: customHeader || headersDefault,
    })
    .catch((error) => {
      return Promise.resolve({ ...error, isError: true });
    });
}
