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

export async function getListRedeemMissionTask(params) {
  return request({
    method: METHOD.GET,
    urlPath: "redeem/mission/list",
    params,
  }).then((response) => {
    return response;
  });
}
