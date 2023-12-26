import axios, { AxiosRequestConfig } from "axios";
import lodash from "lodash";
// eslint-disable-next-line import/no-extraneous-dependencies
import { _getJson, USER_TOKEN } from "@services/local-storage";

export const BASEURL = "https://api.edu-like.exam24h.com/api/";

export const METHOD = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
};

interface RequestOption extends AxiosRequestConfig {
  requestTime?: number;
  retry?: boolean;
}

export const apiClient = axios.create({
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
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
    console.log("error interceptors", error);
    let message: string = error?.response?.data?.message;
    if (lodash.isArray(message)) {
      message = error?.response?.data?.message?.[0] || "";
    }
    return Promise.reject({ ...error, message, isError: true });
  },
);

export default function request({
  params,
  urlPath,
  data,
  method,
  option,
}: {
  urlPath: string;
  params?: any;
  data?: any;
  method?: string;
  option?: RequestOption;
}) {
  return apiClient
    .request({
      method: method || METHOD.POST,
      url: BASEURL + urlPath,
      params,
      data,
      ...option,
    })
    .catch((error) => {
      return Promise.resolve({ ...error, isError: true });
    });
}
