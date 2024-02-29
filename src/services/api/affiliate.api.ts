import request, { METHOD } from "./api";

export async function getListAffiliate(params) {
  return request({
    method: METHOD.GET,
    urlPath: "transaction/user-list",
    params,
  }).then((response) => {
    console.log("listAffiliate...", response);
    return response;
  });
}
export async function getListFilter(params) {
  return request({
    method: METHOD.GET,
    urlPath: "transaction/filter",
    params,
  }).then((response) => {
    return response;
  });
}
export async function getUserIncome(params) {
  return request({
    method: METHOD.GET,
    urlPath: "transaction/user-income",
    params,
  }).then((response) => {
    return response;
  });
}
