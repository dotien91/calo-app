import request, { METHOD } from "./api";

/**
 * make call to partner
 * @param roomId
 */
export enum EnumTypeCall {
  audio = "audio_call",
  video = "video_call",
}

export async function makeCall(
  partnerId: string,
  type: "audio_call" | "video_call",
  callTime: string,
  roomId: string,
  offer?: string,
  answer?: string,
) {
  const data = {
    partner_id: partnerId,
    chat_room_id: roomId,
    call_type: type,
    call_time: callTime,
    offer,
    answer,
  };

  if (!data.answer) {
    delete data.answer;
  }
  if (!data.offer) {
    delete data.offer;
  }
  return request({
    method: METHOD.POST,
    urlPath: "callkit/make-call",
    data,
  }).then((response) => {
    return response;
  });
}

export async function detailCall(params) {
  return request({
    method: METHOD.POST,
    urlPath: "callkit/list",
    params,
  }).then((response) => {
    return response;
  });
}

export async function endCall(
  partnerId: string,
  type: "audio_call" | "video_call",
  callTime: string,
  roomId: string,
) {
  const data = {
    partner_id: partnerId,
    chat_room_id: roomId,
    call_type: type,
    call_time: callTime,
  };
  return request({
    method: METHOD.POST,
    urlPath: "callkit/end-call",
    data,
  }).then((response) => {
    return response;
  });
}
