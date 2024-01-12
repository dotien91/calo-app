import request, { METHOD } from "./api";

export async function getCountFollow(params: any) {
  return request({
    method: METHOD.GET,
    urlPath: "user/follow-count",
    params,
  }).then((response) => {
    return response;
  });
}

export async function getUserById(id: string) {
  return request({
    method: METHOD.GET,
    urlPath: `user/detail/${id}`,
  }).then((response) => {
    return response;
  });
}
