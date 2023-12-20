import request, { METHOD } from "./api";

export async function getVideos(params: any) {
  return request({
    method: METHOD.GET,
    urlPath: "short/list",
    params,
  }).then((response) => {
    return response;
  });
}
