import axios, { AxiosRequestConfig } from "axios";

// eslint-disable-next-line import/no-extraneous-dependencies

export const BASEURL = "https://api.edu-like.exam24h.com/api/";
export const UPLOAD_URL = "https://media.exam24h.com/";

export const METHOD = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
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
    // const token = _getJson(TOKEN);
    //fake token
    /* eslint-disable max-len */
    const token =
      // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzQ1Nzc3MDAsImRhdGEiOnsiX2lkIjoiNjU4MjVhYTQ5ZDY2YWM4YzQ3YzZiMDFkIiwia2V5IjoiOTNiOTgxN2VkZmQ1ZjU1NDBkZTI2MDNiM2M3N2JlZmEiLCJzaWduYXR1cmUiOiI2ZGI5M2RhMzE1YzRjNzBkNjY2YjNiNWRjZjIwYzUzMiIsInNlc3Npb24iOiI2NTgyNWFhNDlkNjZhYzhjNDdjNmIwMWYifSwiaWF0IjoxNzAzMDQxNzAwfQ.R0CrGfSMvi_V3T445vlp75Eetz_x6RHCrWtaSkXo0A8";
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzYyNDE3MDQsImRhdGEiOnsiX2lkIjoiNjU4OTIzMTM4MmE4MWQ2MTg3NzU4ZjdlIiwia2V5IjoiZjRiYzdmYjk4NWI1ZTk0MTdhODExZmVjMTBjMjVkNjQiLCJzaWduYXR1cmUiOiI3YWViNmQ2NGUzYTkyZWZjNGQ3YjAzZWQ0ZTM0ZjFhZiIsInNlc3Npb24iOiI2NTliYmVhODkxMTI1YjAzMDRiOTIzMWIifSwiaWF0IjoxNzA0NzA1NzA0fQ.pYupNtM60korCckbO5JOrmva7wK91gGbO1YwZG3lgdQ";
    if (token) config.headers["X-Authorization"] = token;
    // Do something before request is sent
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
    return response?.data;
  },
  (error) => {
    return Promise.reject({ ...error, isError: true });
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

export function requestUpload({
  params,
  urlPath,
  data,
  method,
  option,
}: {
  urlPath: string;
  params?: any;
  data?: FormData;
  method?: string;
  option?: RequestOption;
}) {
  return apiClient
    .request({
      method: method || METHOD.POST,
      url: urlPath,
      params,
      data,
      ...option,
      headers: { "Content-Type": "multipart/form-data" },
    })
    .catch((error) => {
      return Promise.resolve({ ...error, isError: true });
    });
}
