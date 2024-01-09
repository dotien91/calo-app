import request, { METHOD } from "./api";

export async function createLiveStream(title: string) {
  return request({
    method: METHOD.POST,
    urlPath: "livestream/create",
    data: { title },
  }).then((response) => {
    return response;
  });
}

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

export async function getChatLiveHistory(params) {
  return request({
    method: METHOD.GET,
    urlPath: `livestream/list-comment/${params.id}`,
    params,
  }).then((response) => {
    return response;
  });
}

export async function sendChatToLiveRoom(data) {
  return request({
    method: METHOD.POST,
    urlPath: "livestream/create-comment",
    data,
  }).then((response) => {
    return response;
  });
}

interface ILikeLiveStream {
  react_type: string;
  livestream_id: string;
}
export async function likeLiveStream(data: ILikeLiveStream) {
  return request({
    method: METHOD.POST,
    urlPath: "livestream/like",
    data,
  }).then((response) => {
    console.log("ressssssssss", response);
    return response;
  });
}

export async function updateLivestream(liveStreamStatus: string) {
  return request({
    method: METHOD.PATCH,
    urlPath: "livestream/update",
    data: { livestream_status: liveStreamStatus },
  }).then((response) => {
    return response;
  });
}

export async function getListLiveStream() {
  return request({
    method: METHOD.GET,
    urlPath: "livestream/list",
  }).then((response) => {
    return response;
  });
}

export async function getLiveStreamDetail(id: string) {
  return request({
    method: METHOD.GET,
    urlPath: `livestream/detail/${id}`,
  }).then((response) => {
    return response;
  });
}
