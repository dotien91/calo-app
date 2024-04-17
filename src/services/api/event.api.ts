import request, { METHOD } from "./api";

export interface TypeCreateEvent {
  name?: string;
  cover?: string;
  location?: string;
  end_time?: string;
  start_time?: string;
  group_id?: string;
}

export interface TypeListEvent {
  _id: string;
  name: string;
  cover?: string;
  start_time: string;
  end_time: string;
  location?: string;
  group_id: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getListEventGroup(data) {
  return request({
    method: METHOD.POST,
    urlPath: "group/event/list",
    data,
  }).then((response) => {
    console.log("res....", response, "....", data);
    return response;
  });
}

export async function createEvent(data: TypeCreateEvent) {
  return request({
    method: METHOD.POST,
    urlPath: "group/event/create",
    data,
  }).then((response) => {
    return response;
  });
}

export async function deleteEventID(_id: string) {
  return request({
    method: METHOD.DELETE,
    urlPath: `group/event/delete/${_id}`,
  }).then((response) => {
    return response;
  });
}

export async function updateEvent(data: TypeCreateEvent) {
  return request({
    method: METHOD.PATCH,
    urlPath: "group/event/update",
    data,
  }).then((response) => {
    return response;
  });
}
