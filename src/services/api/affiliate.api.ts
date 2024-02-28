import request, { METHOD } from "./api";

export async function getListAffiliate(params) {
  return request({
    method: METHOD.GET,
    urlPath: "transaction/user-list",
    params,
  }).then((response) => {
    return response;
  });
}
