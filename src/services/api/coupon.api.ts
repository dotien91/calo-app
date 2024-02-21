import request, { METHOD } from "./api";

interface LisCouponRequestType {
  limit: string;
  order_by?: string;
  page?: string;
  payment_method: "all" | "transfer" | "vn_pay";
  title?: string;
  type: "product";
  user_id?: string;
  visible?: "private" | "public" | "product";
}

export async function getListCoupon(params: LisCouponRequestType) {
  return request({
    method: METHOD.GET,
    urlPath: "coupon/list",
    params,
  }).then((response) => {
    return response;
  });
}

export async function detailCouponByID(id: string) {
  return request({
    method: METHOD.GET,
    urlPath: `coupon/detail/${id}`,
  }).then((response) => {
    return response;
  });
}

interface CouponByUserType {
  limit: string;
  page: string;
}

export async function CouponByUser(data: CouponByUserType) {
  return request({
    method: METHOD.POST,
    urlPath: "coupon/user",
    data,
  }).then((response) => {
    return response;
  });
}

export interface CouponType {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  promotion: number;
  payment_method: "all" | "transfer" | "vn_pay";
  type: "product";
  promotion_type: "percentage" | "value";
  promotion_max?: number;
  promotion_min_trigger?: number;
  visible?: string;
  user_id?: string;
}

export async function CreateNewCoupon(data: CouponType) {
  return request({
    method: METHOD.POST,
    urlPath: "coupon/create",
    data,
  }).then((response) => {
    return response;
  });
}

export async function UpdateCoupon(data: CouponType) {
  return request({
    method: METHOD.PATCH,
    urlPath: "coupon/update",
    data,
  }).then((response) => {
    return response;
  });
}
