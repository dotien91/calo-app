import request, { METHOD } from "./api";

export async function getListNotification(params) {
  return request({
    method: METHOD.GET,
    urlPath: "notification/user-list",
    params,
  }).then((response) => {
    return response;
  });
}

export async function readNotification(params) {
  return request({
    method: METHOD.POST,
    urlPath: "notification/update",
    data: params,
  }).then((response) => {
    return response;
  });
}
export async function deleteNotification(params) {
  return request({
    method: METHOD.DELETE,
    urlPath: "notification/delete",
    data: params,
  }).then((response) => {
    return response;
  });
}
