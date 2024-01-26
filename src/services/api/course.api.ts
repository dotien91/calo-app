import request, { METHOD } from "./api";

export async function getCourseList(data) {
  return request({
    method: METHOD.POST,
    urlPath: "course/list",
    data,
  }).then((response) => {
    console.log("res courlust", { data, response });
    return response;
  });
}

export async function getCourseFilterKeys() {
  return request({
    method: METHOD.GET,
    urlPath: "course/filter-items",
  }).then((response) => {
    return response;
  });
}

export async function getListTutor(data) {
  return request({
    method: METHOD.POST,
    urlPath: "course/list-tutor",
    data,
  }).then((response) => {
    return response;
  });
}
