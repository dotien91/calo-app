import request, { METHOD } from "./api";

export async function getListScore(params) {
  return request({
    method: METHOD.GET,
    urlPath: "test/user/stats",
    params,
  }).then((response) => {
    return response;
  });
}
