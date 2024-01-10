import request, { METHOD } from "./api";
import { ISendMessage } from "@services/models/ChatModels";

export async function getListChat(params) {
  return request({
    method: METHOD.GET,
    urlPath: "chat-room/list",
    params,
  }).then((response) => {
    console.log("resssss", response);
    return response;
  });
}

export async function getListFriend() {
  return request({
    method: METHOD.GET,
    urlPath: "user/list/friend",
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
