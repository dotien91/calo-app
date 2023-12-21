import request, { METHOD } from "./api";

export async function getCurrentUser() {
  return request({
    method: METHOD.GET,
    urlPath: "user/me",
  }).then((response) => {
    return response;
  });
}
