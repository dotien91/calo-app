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

export async function getListGroup(params) {
  return request({
    method: METHOD.GET,
    urlPath: "group/list",
    params,
  }).then((response) => {
    return response;
  });
}

export async function getMemberGroup(id: string) {
  return request({
    method: METHOD.GET,
    urlPath: `group/member/list/${id}`,
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
    method: METHOD.GET,
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
    method: METHOD.GET,
    urlPath: "group/member/create",
    data,
  }).then((response) => {
    return response;
  });
}
