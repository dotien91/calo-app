import { LANG, _getJson } from "@services/local-storage";
import request, { METHOD } from "./api";

export async function GetPodCastList(params) {
  params.lang = _getJson(LANG) || "en";
  return request({
    method: METHOD.GET,
    urlPath: "podcast/list",
    params,
  }).then((response) => {
    return response;
  });
}

export async function ListReview(params) {
  return request({
    method: METHOD.GET,
    urlPath: "podcast/review/list",
    params,
  }).then((response) => {
    return response;
  });
}

export async function CreateReview(data) {
  return request({
    method: METHOD.POST,
    urlPath: "podcast/review/create",
    data,
  }).then((response) => {
    return response;
  });
}

export async function getListCategory(params) {
  return request({
    method: METHOD.GET,
    urlPath: "podcast/list-category",
    params,
  }).then((response) => {
    return response;
  });
}

export async function DeleteReview(id: string) {
  return request({
    method: METHOD.DELETE,
    urlPath: `podcast/review/delete/${id}`,
  }).then((response) => {
    return response;
  });
}

export async function GetPodCastDetail(id: string) {
  return request({
    method: METHOD.GET,
    urlPath: `podcast/detail/${id}`,
  }).then((response) => {
    return response;
  });
}
