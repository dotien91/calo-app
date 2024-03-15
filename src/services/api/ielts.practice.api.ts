import request, { METHOD } from "./api";

export async function getDetailPractice({ id }: { id: string }) {
  return request({
    method: METHOD.GET,
    urlPath: `test/detail/${id}`,
  }).then((response) => {
    return response;
  });
}

export async function getQuestionsPractice(params: { test_id: string }) {
  return request({
    method: METHOD.GET,
    urlPath: "test/question/list",
    params,
  }).then((response) => {
    return response;
  });
}

export async function getDetailQuestion(id: string) {
  return request({
    method: METHOD.GET,
    urlPath: `test/question/detail/${id}`,
  }).then((response) => {
    return response;
  });
}

export async function submitTest(data: any) {
  return request({
    method: METHOD.POST,
    urlPath: "test/user/submit",
    data,
  }).then((response) => {
    return response;
  });
}
