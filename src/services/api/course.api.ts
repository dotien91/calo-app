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

export async function getCourseClassListById(course_id: string) {
  return request({
    method: METHOD.GET,
    urlPath: "course/class/list",
    params: { course_id },
  }).then((response) => {
    return response;
  });
}

export async function getCourseDetail(id: string, params) {
  return request({
    method: METHOD.GET,
    urlPath: `course/detail/${id}`,
    params,
  }).then((response) => {
    return response;
  });
}
export async function getListModule(params) {
  return request({
    method: METHOD.GET,
    urlPath: "course/list-module",
    params,
  }).then((response) => {
    return response;
  });
}
export async function getListReview(params) {
  return request({
    method: METHOD.GET,
    urlPath: "course/list-review",
    params,
  }).then((response) => {
    return response;
  });
}

interface INewReview {
  course_id: string;
  user_id?: string;
  review: string;
  rating: number;
}
export async function createReview(data: INewReview) {
  return request({
    method: METHOD.POST,
    urlPath: "course/create-review",
    data,
  }).then((response) => {
    return response;
  });
}

interface IUpdateReview {
  _id: string;
  review: string;
  rating: number;
}
export async function updateReview(data: IUpdateReview) {
  return request({
    method: METHOD.PATCH,
    urlPath: "course/update-review",
    data,
  }).then((response) => {
    return response;
  });
}
