import { USER_TOKEN, _setJson } from "@services/local-storage";
import request, { METHOD } from "./api";
import {
  ILoginWithSocialType,
  ISignUpWithEmail,
  ILoginWithPass,
  IRequestNewPass,
  IVerifyCode,
  ICreateNewPass,
} from "models";

export async function getCurrentUser() {
  return request({
    method: METHOD.GET,
    urlPath: "user/me",
  }).then((response) => {
    return response;
  });
}

export async function loginWithGoogle(data: ILoginWithSocialType) {
  _setJson(USER_TOKEN, "");
  return request({
    method: METHOD.POST,
    urlPath: "user/login/google",
    data,
  }).then((response) => {
    return response;
  });
}

export async function loginWithFB(data: ILoginWithSocialType) {
  _setJson(USER_TOKEN, "");

  return request({
    method: METHOD.POST,
    urlPath: "user/login/facebook",
    data,
  }).then((response) => {
    console.log("responseresponseresponse fb", { response, data });
    return response;
  });
}

export async function singUp(data: ISignUpWithEmail) {
  return request({
    method: METHOD.POST,
    urlPath: "user/login/sign-up",
    data,
  }).then((response) => {
    return response;
  });
}

export async function loginWithPass(data: ILoginWithPass) {
  return request({
    method: METHOD.POST,
    urlPath: "user/login/password",
    data,
  }).then((response) => {
    return response;
  });
}

export async function requestNewPassWithEmail(data: IRequestNewPass) {
  return request({
    method: METHOD.POST,
    urlPath: "user/forgot-password/email",
    data,
  }).then((response) => {
    return response;
  });
}

export async function verifyCode(data: IVerifyCode) {
  return request({
    method: METHOD.POST,
    urlPath: "user/verify-code",
    data,
  }).then((response) => {
    return response;
  });
}

export async function createNewPass(data: ICreateNewPass) {
  return request({
    method: METHOD.PATCH,
    urlPath: "user/create-password",
    data,
  }).then((response) => {
    return response;
  });
}
export async function updateProfile(data: any) {
  return request({
    method: METHOD.PATCH,
    urlPath: "user/update/user",
    data,
  }).then((response) => {
    return response;
  });
}

export async function getCountFollow(params: any) {
  return request({
    method: METHOD.GET,
    urlPath: "user/follow-count",
    params,
  }).then((response) => {
    return response;
  });
}

export async function getUserById(id: string) {
  return request({
    method: METHOD.GET,
    urlPath: `user/detail/${id}`,
  }).then((response) => {
    return response;
  });
}

export async function getListUser(params: { search: string }) {
  return request({
    method: METHOD.GET,
    urlPath: "user/list",
    params: { ...params, display_name: params?.search || "" },
  });
}

export async function deleteUserById(id: string) {
  return request({
    method: METHOD.DELETE,
    urlPath: `user/delete/${id}`,
  });
}

export async function getListBlock() {
  return request({
    method: METHOD.GET,
    urlPath: "user/block-list",
  }).then((response) => {
    return response;
  });
}

export async function getListFollower(params: any) {
  return request({
    method: METHOD.GET,
    urlPath: "user/list/followers",
    params,
  }).then((response) => {
    return response;
  });
}

export async function getListFollowing(params: any) {
  return request({
    method: METHOD.GET,
    urlPath: "user/list/following",
    params,
  }).then((response) => {
    return response;
  });
}

export async function postFollow(data: any) {
  return request({
    method: METHOD.POST,
    urlPath: "user/follow",
    data,
  }).then((response) => {
    return response;
  });
}

export async function postunFollow(data: any) {
  return request({
    method: METHOD.POST,
    urlPath: "user/un-follow",
    data,
  }).then((response) => {
    return response;
  });
}

export async function ignoreFollower(data: any) {
  return request({
    method: METHOD.POST,
    urlPath: "user/ignore-follower",
    data,
  }).then((response) => {
    return response;
  });
}

export async function postUnBlockUser(data: any) {
  return request({
    method: METHOD.POST,
    urlPath: "user/un-block",
    data,
  }).then((response) => {
    return response;
  });
}

export async function getListLeaderBoard(params: any) {
  return request({
    method: METHOD.GET,
    urlPath: "user/ranking",
    params,
  }).then((response) => {
    return response;
  });
}
