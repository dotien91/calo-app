import request, { METHOD } from "./api";

export async function createVnpayUrl(data) {
  return request({
    method: METHOD.POST,
    urlPath: "order/create",
    data,
  }).then((response) => {
    return response;
  });
}

export async function getOrderDetail(id: string) {
  return request({
    method: METHOD.GET,
    urlPath: `order/detail-order/${id}`,
  }).then((response) => {
    return response;
  });
}

export async function addMemberToClass(data) {
  return request({
    method: METHOD.POST,
    urlPath: "course/class/add-member",
    data,
  }).then((response) => {
    return response;
  });
}

export async function addStudentTimepick(data) {
  return request({
    method: METHOD.POST,
    urlPath: "course/one-one/student-create",
    data,
  }).then((response) => {
    return response;
  });
}

export async function updateUserOrder(data) {
  return request({
    method: METHOD.POST,
    urlPath: "order/user-update",
    data,
  });
}

export async function getQRcode() {
  return request({
    method: METHOD.GET,
    urlPath: "config/list/qr_code",
  }).then((response) => {
    return response;
  });
}
