import request, { METHOD } from "./api";

export async function createVnpayUrl() {
  const data = {
    plan_id: "65b320bf08783f8ceaedf35a",
    payment_method: "vn_pay",
    amount_of_package: "1",
  };
  return request({
    method: METHOD.POST,
    urlPath: "order/create",
    data,
  }).then((response) => {
    return response;
  });
}
