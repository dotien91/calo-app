import request, { METHOD } from "./api";

export async function getCourseList(params) {
  return request({
    method: METHOD.GET,
    urlPath: "course/list",
    params,
  }).then((response) => {
    return response;
  });
}
