import axios, { AxiosRequestConfig } from "axios";
// import {
//   _getJson,
// } from "@services/local-storage";
// eslint-disable-next-line import/no-extraneous-dependencies

export const BASEURL = "https://api.edu-like.exam24h.com/api/";

export const METHOD = {
  GET: "GET",
  POST: "POST",
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
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject({ error, isError: true });
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
      return Promise.resolve({ error, isError: true });
    });
}
