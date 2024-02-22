import request, { METHOD } from "./api";

export async function getListTask(params) {
  return request({
    method: METHOD.GET,
    urlPath: "redeem/list",
    params,
  }).then((response) => {
    return response;
  });
}
