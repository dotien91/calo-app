import request, { METHOD } from "./api";

export async function getCourseList(data) {
  return request({
    method: METHOD.POST,
    urlPath: "course/list",
    data,
  }).then((response) => {
    return response;
  });
}
export async function getCourseSuggest(data) {
  return request({
    method: METHOD.POST,
    urlPath: "course/suggest",
    data,
  }).then((response) => {
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
    data: { ...data, display_name: data?.search || "" },
  }).then((response) => {
    console.log("response list-tutor", response);
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

export async function getTimeAvailableTeacher(course_id: string) {
  return request({
    method: METHOD.GET,
    urlPath: "course/one-one/time-available",
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
interface IcheckCourseOneOne {
  course_id: string;
  user_id: string;
  time_pick: { time_end: string; day: number; time_start: string }[];
}
export async function checkCourseOneOne(data: IcheckCourseOneOne) {
  return request({
    method: METHOD.POST,
    urlPath: "course/one-one/student/check",
    data,
  }).then((response) => {
    return response;
  });
}
export async function checkUserAddToClass(data) {
  return request({
    method: METHOD.POST,
    urlPath: "course/class/member/check",
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

export async function getTimeAvailable(params) {
  return request({
    method: METHOD.GET,
    urlPath: "course/one-one/time-available",
    params,
  }).then((response) => {
    return response;
  });
}

interface ICreateCourse {
  _id: string;
  title?: string;
  description?: string;
  long_description?: string;
  price?: string;
  start_time?: string;
  end_time?: string;
  language?: string;
  country?: string;
  avatar?: string;
  media_id?: string;
  public_status?: string;
}

export async function createCourse(data: ICreateCourse) {
  return request({
    method: METHOD.POST,
    urlPath: "course/create",
    data,
  }).then((response) => {
    return response;
  });
}

export async function updateCourse(data: ICreateCourse) {
  return request({
    method: METHOD.PATCH,
    urlPath: "course/update",
    data,
  }).then((response) => {
    return response;
  });
}

interface CourseAddType {
  time_duration: number;
  day: number;
  time_start: string;
}

interface ICreateClass {
  course_id: string;
  course_calendars: CourseAddType[];
  name: string;
  limit_member: number;
}

export async function createClass(data: ICreateClass) {
  return request({
    method: METHOD.POST,
    urlPath: "course/class/create",
    data,
  }).then((response) => {
    return response;
  });
}

export async function getListClassOfCourse(params) {
  return request({
    method: METHOD.GET,
    urlPath: "course/class/list",
    params,
  }).then((response) => {
    return response;
  });
}
export async function updateViewed(data: { module_id: string }) {
  return request({
    method: METHOD.POST,
    urlPath: "course/view",
    data,
  }).then((response) => {
    return response;
  });
}

export async function createTimeAvailableTeacher(data) {
  return request({
    method: METHOD.POST,
    urlPath: "course/one-one/teacher/create",
    data,
  }).then((response) => {
    return response;
  });
}
export async function updateTimeAvailableTeacher(data) {
  return request({
    method: METHOD.PATCH,
    urlPath: "course/one-one/teacher/update",
    data,
  }).then((response) => {
    return response;
  });
}

export async function _getTimeAvailableTeacher(params) {
  return request({
    method: METHOD.GET,
    urlPath: "course/one-one/teacher",
    params,
  }).then((response) => {
    return response;
  });
}

export async function addViewToCourse(data: ICreateCourse) {
  return request({
    method: METHOD.POST,
    urlPath: "course/view",
    data,
  }).then((response) => {
    return response;
  });
}

export async function addModuleToCourse(data: ICreateCourse) {
  return request({
    method: METHOD.POST,
    urlPath: "course/create-module",
    data,
  }).then((response) => {
    return response;
  });
}

export async function deleteClass(id: string) {
  return request({
    method: METHOD.DELETE,
    urlPath: `course/class/delete/${id}`,
  }).then((response) => {
    return response;
  });
}

export async function deleteCourse(id: string) {
  return request({
    method: METHOD.DELETE,
    urlPath: `course/delete/${id}`,
  }).then((response) => {
    return response;
  });
}

export async function updateModule(data) {
  return request({
    method: METHOD.PATCH,
    urlPath: "course/update-module",
    data,
  }).then((response) => {
    return response;
  });
}

export async function deleteModule(id: string) {
  return request({
    method: METHOD.DELETE,
    urlPath: `course/delete-module/${id}`,
  }).then((response) => {
    return response;
  });
}

export async function getCourseRoom(params: {
  user_id: string;
  course_id: string;
  class_id: string;
}) {
  return request({
    method: METHOD.GET,
    urlPath: "course/room",
    params,
  }).then((response) => {
    return response;
  });
}

export async function getListMemberCourse(params: {
  auth_id: string;
  course_id: string;
}) {
  return request({
    method: METHOD.GET,
    urlPath: "course/list-member",
    params,
  }).then((response) => {
    return response;
  });
}

export async function getMyCourse(data: {
  created_user_id: string;
  auth_id: string;
}) {
  return request({
    method: METHOD.POST,
    urlPath: "course/my-course",
    data,
  }).then((response) => {
    return response;
  });
}

export async function getCourseSale(data) {
  return request({
    method: METHOD.POST,
    urlPath: "course/sale",
    data,
  }).then((response) => {
    return response;
  });
}

export async function saveCouponToUser(data) {
  return request({
    method: METHOD.POST,
    urlPath: "coupon/save",
    data,
  }).then((response) => {
    return response;
  });
}

export async function getListThread(params, customHeader) {
  return request({
    method: METHOD.GET,
    urlPath: "thread/list",
    params,
    customHeader,
  }).then((response) => {
    return response;
  });
}

export async function createThread(data, customHeader) {
  return request({
    method: METHOD.POST,
    urlPath: "thread/create",
    data,
    customHeader,
  }).then((response) => {
    return response;
  });
}

export async function updateThread(data, customHeader) {
  return request({
    method: METHOD.PATCH,
    urlPath: "thread/update",
    data,
    customHeader,
  }).then((response) => {
    return response;
  });
}

export async function deleteThread(id, customHeader) {
  return request({
    method: METHOD.DELETE,
    urlPath: `thread/delete/${id}`,
    customHeader,
  }).then((response) => {
    return response;
  });
}

export async function getDetailThread(id, customHeader) {
  return request({
    method: METHOD.GET,
    urlPath: `thread/detail/${id}`,
    customHeader,
  }).then((response) => {
    return response;
  });
}

export async function addCommentThread(data, customHeader) {
  return request({
    method: METHOD.POST,
    urlPath: "thread/comment/create",
    data,
    customHeader,
  }).then((response) => {
    return response;
  });
}

export async function deleteThreadComment(id, customHeader) {
  return request({
    method: METHOD.DELETE,
    urlPath: `thread/comment/delete/${id}`,
    customHeader,
  }).then((response) => {
    return response;
  });
}

export async function handedInTask(data, customHeader) {
  return request({
    method: METHOD.PATCH,
    urlPath: "thread/comment/mark",
    customHeader,
    data,
  }).then((response) => {
    return response;
  });
}

export async function uploadUserExam(data, customHeader) {
  return request({
    method: METHOD.POST,
    urlPath: "thread/comment/upload",
    data,
    customHeader,
  }).then((response) => {
    return response;
  });
}

export async function getListCommentThread(params, customHeader) {
  return request({
    method: METHOD.GET,
    urlPath: "thread/comment/list",
    params,
    customHeader,
  }).then((response) => {
    return response;
  });
}

export async function pinShoppingLiveRequest(data) {
  return request({
    method: METHOD.POST,
    urlPath: "livestream/product",
    data,
  }).then((response) => {
    return response;
  });
}

export async function addUserToCourseVideo(data: {
  course_id: string;
  add_type: string;
  user_id: string;
}) {
  return request({
    method: METHOD.POST,
    urlPath: "course/add-user",
    data,
  }).then((response) => {
    return response;
  });
}
