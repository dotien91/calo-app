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

export async function postWithDrawal(data) {
  return request({
    method: METHOD.POST,
    urlPath: "transaction/withdrawal",
    data,
  }).then((response) => {
    return response;
  });
}

export async function createBank(data) {
  return request({
    method: METHOD.POST,
    urlPath: "transaction/create-bank",
    data,
  }).then((response) => {
    return response;
  });
}

export async function getListBank(params) {
  return request({
    method: METHOD.GET,
    urlPath: "transaction/list-bank",
    params,
  }).then((response) => {
    return response;
  });
}

export async function updateBank(data) {
  return request({
    method: METHOD.PATCH,
    urlPath: "transaction/update-bank",
    data,
  }).then((response) => {
    return response;
  });
}

export async function deleteBank(id: string) {
  return request({
    method: METHOD.DELETE,
    urlPath: `transaction/delete-bank/${id}`,
  }).then((response) => {
    return response;
  });
}

export async function getCommission(params?: any) {
  return request({
    method: METHOD.GET,
    urlPath: "config/list/affiliate",
    params,
  }).then((response) => {
    return response;
  });
}

export async function getTypeCallGroup(params?: any) {
  return request({
    method: METHOD.GET,
    urlPath: "config/list/callgroup",
    params,
  }).then((response) => {
    return response;
  });
}
