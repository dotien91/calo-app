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
  return request({
    method: METHOD.POST,
    urlPath: "user/login/google",
    data,
  }).then((response) => {
    return response;
  });
}

export async function loginWithFB(data: ILoginWithSocialType) {
  return request({
    method: METHOD.POST,
    urlPath: "user/login/facebook",
    data,
  }).then((response) => {
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
