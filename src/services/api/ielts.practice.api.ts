import request, { METHOD } from "./api";

export async function getDetailPractice({ id }: { id: string }) {
  return request({
    method: METHOD.GET,
    urlPath: `test/detail/${id}`,
  }).then((response) => {
    return response;
  });
}
