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
    method: METHOD.POST,
    urlPath: "group/update",
    data,
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
    console.log("res....", response, "...", data);
    return response;
  });
}

export async function getMemberGroup(data) {
  return request({
    method: METHOD.POST,
    urlPath: "group/member/list",
    data,
  }).then((response) => {
    console.log("res....", response, "...", data);
    return response;
  });
}

interface addMember {
  group_id: string;
  user_id: string;
  tier: string | number;
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
  tier: string | number;
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
interface memberMe {
  group_id: string;
  user_id: string;
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
