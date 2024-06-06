import request, { METHOD } from "./api";
import { ISendMessage } from "@services/models/ChatModels";

export async function getListChat(params) {
  return request({
    method: METHOD.GET,
    urlPath: "chat-room/list",
    params,
  }).then((response) => {
    return response;
  });
}

export async function getListFriend(params) {
  return request({
    method: METHOD.GET,
    urlPath: "user/list/friend",
    params,
  }).then((response) => {
    return response;
  });
}

export async function setViewRoom(id: string) {
  return request({
    method: METHOD.POST,
    urlPath: `chat-room/view/${id}`,
  }).then((response) => {
    return response;
  });
}

export async function getChatHistory(params) {
  return request({
    method: METHOD.GET,
    urlPath: `chat-history/room/${params.id}`,
    params,
  }).then((response) => {
    return response;
  });
}

export async function sendChatToChatRoom(data: ISendMessage) {
  return request({
    method: METHOD.POST,
    urlPath: "chat-history/create",
    data,
  }).then((response) => {
    return response;
  });
}

interface INewChatRoom {
  partner_id: string;
  chat_type: string;
}

export async function createChatRoom(data: INewChatRoom) {
  return request({
    method: METHOD.POST,
    urlPath: "chat-room/create",
    data,
  }).then((response) => {
    return response;
  });
}

export async function addUserToRoom(data: any) {
  return request({
    method: METHOD.POST,
    urlPath: "chat-room/user-role",
    data,
  }).then((response) => {
    return response;
  });
}

export async function leaveRoom(data: any) {
  return request({
    method: METHOD.DELETE,
    urlPath: "chat-room/user-role",
    data,
  }).then((response) => {
    return response;
  });
}

export async function viewRoom(params: { id: string }) {
  return request({
    method: METHOD.GET,
    urlPath: `chat-room/${params.id}`,
  }).then((response) => {
    return response;
  });
}

export async function changeNameGroup(data: any) {
  return request({
    method: METHOD.PATCH,
    urlPath: "chat-room/update-room",
    data,
  }).then((response) => {
    return response;
  });
}

export async function getCount(params) {
  return request({
    method: METHOD.GET,
    urlPath: "chat-room/count-reply",
    params,
  }).then((response) => {
    return response;
  });
}
