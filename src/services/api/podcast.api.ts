import request, { METHOD } from "./api";

export async function GetPodCastList(params) {
  return request({
    method: METHOD.GET,
    urlPath: "podcast/list",
    params,
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
