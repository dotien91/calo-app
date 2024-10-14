import request, { METHOD } from "./api";

interface TypeCreateGroup {
  name: string;
  avatar?: string;
  cover?: string;
}

export async function createGroup(data: TypeCreateGroup) {
  return request({
    method: METHOD.POST,
    urlPath: "group/create",
    data,
  }).then((response) => {
    return response;
  });
}

interface TypeUpdateGroup {
  _id: string;
  name?: string;
  avatar?: string;
  cover?: string;
}

export async function updateGroup(data: TypeUpdateGroup) {
  return request({
    method: METHOD.PATCH,
    urlPath: "group/update",
    data,
  }).then((response) => {
    return response;
  });
}

export async function getDetailGroup(id: string) {
  return request({
    method: METHOD.GET,
    urlPath: `group/detail/${id}`,
  }).then((response) => {
    return response;
  });
}

export async function removeGroup(_id: string) {
  return request({
    method: METHOD.DELETE,
    urlPath: `group/delete/${_id}`,
  }).then((response) => {
    return response;
  });
}

export async function getListGroup(data) {
  return request({
    method: METHOD.POST,
    urlPath: "group/list",
    data,
  }).then((response) => {
    return response;
  });
}

export async function getMemberGroup(data) {
  return request({
    method: METHOD.POST,
    urlPath: "group/member/list",
    data,
  }).then((response) => {
    return response;
  });
}

interface addMember {
  group_id: string;
  user_id: string;
  tier: string;
}

export async function addMemberGroup(data: addMember) {
  return request({
    method: METHOD.POST,
    urlPath: "group/member/create",
    data,
  }).then((response) => {
    return response;
  });
}

interface updateMember {
  _id: string;
  group_id: string;
  user_id: string;
  tier: string;
}

export async function updateMemberGroup(data: updateMember) {
  return request({
    method: METHOD.PATCH,
    urlPath: "group/member/update",
    data,
  }).then((response) => {
    return response;
  });
}

export async function deleteMemberGroup(id: string) {
  return request({
    method: METHOD.DELETE,
    urlPath: `group/member/delete/${id}`,
  }).then((response) => {
    return response;
  });
}

interface memberMe {
  group_id: string;
  user_id: string | undefined;
}

export async function checkMemberMe(data: memberMe) {
  return request({
    method: METHOD.POST,
    urlPath: "group/member/me",
    data,
  }).then((response) => {
    return response;
  });
}

export async function getCourseClub(params: memberMe) {
  return request({
    method: METHOD.GET,
    urlPath: "group/course/list",
    params,
  }).then((response) => {
    return response;
  });
}

export async function addCourseClub(data) {
  return request({
    method: METHOD.POST,
    urlPath: "group/course/create",
    data,
  }).then((response) => {
    return response;
  });
}

export async function removeCourseClub(params) {
  return request({
    method: METHOD.DELETE,
    urlPath: "group/course/delete/",
    params,
  }).then((response) => {
    return response;
  });
}

export async function getMediaClub(params: { group_id: string; type: string }) {
  return request({
    method: METHOD.GET,
    urlPath: `media/club/${params.group_id}`,
    params,
  }).then((response) => {
    return response;
  });
}

export async function getMediaChat(params: {
  chat_room_id: string;
  type: string;
}) {
  return request({
    method: METHOD.GET,
    urlPath: `media/room/${params.chat_room_id}`,
    params,
  }).then((response) => {
    return response;
  });
}

export async function requestEliteClub(data) {
  return request({
    method: METHOD.POST,
    urlPath: "group/create/elite-request",
    data,
  }).then((response) => {
    return response;
  });
}
