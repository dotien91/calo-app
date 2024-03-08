import axios, { AxiosRequestConfig } from "axios";
import lodash from "lodash";
// eslint-disable-next-line import/no-extraneous-dependencies
import { _getJson, USER_TOKEN } from "@services/local-storage";

export const BASEURL = "https://api.edu-like.exam24h.com/api/";
export const UPLOAD_URL = "https://media.exam24h.com/";
// const tokenTeacher =
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzg4MzEzMzQsImRhdGEiOnsiX2lkIjoiNjU5ZTU5ZDExNzc1YWJiZDZkOTlkMGIzIiwia2V5IjoiNTRhZjQxZGUxZTljNmNhZTFlYmI0ZjQ3NmI4NDg2ZmMiLCJzaWduYXR1cmUiOiIxY2Y2ODMwNWJkOTAyMjEyMDY1MTU3ODQyZWQ1ZTZjNiIsInNlc3Npb24iOiI2NWMzNDI2NjU1MDVmYjI3OGNiYjE5ZDgifSwiaWF0IjoxNzA3Mjk1MzM0fQ.ckhT-GeS2WVJTDEbQjU-ItSznb3aUAZ1GihSWSDmW2g";

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

    // fake token for chat feature
    // const userToken =
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDA2NDk0OTQsImRhdGEiOnsiX2lkIjoiNjU5MGVmNzEzZjlhMDQ2OGM4MjkwZWI5Iiwia2V5IjoiYTI0MTcxYzcxYjNjMjViZWI0OTQzMTQ1NjQyZjJmNTciLCJzaWduYXR1cmUiOiI4ZTJmODFmZjY1NmRjMjUyYzZhNmVlZGFkN2U3ZTc3OCIsInNlc3Npb24iOiI2NWRmMDA5NWMzMzE1ZjhjZmMwOTk2MWUifSwiaWF0IjoxNzA5MTEzNDk0fQ.bhcKT-0CbTascOTqne8ZzXE4bSTke4EzD9hArh7rX1Y"
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzk1OTA3NDIsImRhdGEiOnsiX2lkIjoiNjU4NTQ2MGFkZmRlNWE0MzNjOTg2YzY3Iiwia2V5IjoiMjQzMzJhMDZhNmY5MjJhOWM4MmY3MzhjN2U1ZDY5OTYiLCJzaWduYXR1cmUiOiJjZWQ0NTFkZDEwYmMyZTM2ZmVjZjIyN2UyYzNiY2ZiOSIsInNlc3Npb24iOiI2NWNlZDhkNTU1MDVmYjI3OGNjNmE3YTUifSwiaWF0IjoxNzA4MDU0NzQyfQ._-du9ni1QDzFBG3NKiKmp-kRIr_Ja524UoZbBZlG04g";
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzQ1OTAxNTEsImRhdGEiOnsiX2lkIjoiNjU4MjVkY2RmYjQyMmU4NmEyMDBlN2ZiIiwia2V5IjoiMjZjNGVkODZmM2RjOTUxN2JlYWViY2UxNTQzMmE0NWUiLCJzaWduYXR1cmUiOiJjNGI1NDEzMGQ0MjNhYzc2ZDA1MjYzODAzMWNhYzBmNyIsInNlc3Npb24iOiI2NTgyOGI0NzhmZTc2YzllMzE0YmM1YmQifSwiaWF0IjoxNzAzMDU0MTUxfQ.CsNtK6PcYGCW0hLfZrvAvxWoihVG9GkkyyMQmz6Oopg";
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
