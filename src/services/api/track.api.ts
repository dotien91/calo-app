import request, { IResponse, METHOD } from "./api";

export type TrackingType = "body";
export type TrackingMetric = "weight" | "water";

export interface CreateTrackingBody {
  type: TrackingType;
  metric: TrackingMetric;
  value: number;
  tracked_at: string; // ISO string
}

export interface CreateTrackingResponse {
  [key: string]: any;
}

/** Item trả về từ GET /tracking/my-body */
export interface MyBodyTrackingItem {
  _id: string;
  user_id: object;
  type: "body";
  metric: "weight" | "water";
  value: number | string;
  tracked_at: string;
  createdAt: number;
  updatedAt: number;
}

export interface GetMyBodyTrackingParams {
  page?: number;
  limit?: number;
  order_by?: "ASC" | "DESC";
  metric?: "weight" | "water";
  date_from?: string; // YYYY-MM-DD
  date_to?: string;   // YYYY-MM-DD
}

export interface GetMyBodyTrackingResult {
  data: MyBodyTrackingItem[];
  totalCount: number;
}

export async function createTracking(
  data: CreateTrackingBody
): Promise<IResponse<CreateTrackingResponse>> {
  return request({
    method: METHOD.POST,
    urlPath: "tracking/create",
    data,
  }).then((response: any) => response);
}

/**
 * Lấy danh sách Body Tracking của user (cho chart theo tháng).
 * Header X-Total-Count chứa tổng số bản ghi.
 */
export async function getMyBodyTracking(
  params: GetMyBodyTrackingParams
): Promise<GetMyBodyTrackingResult> {
  const res: any = await request({
    method: METHOD.GET,
    urlPath: "tracking/my-body",
    params: {
      ...params,
      order_by: params.order_by ?? "ASC",
      limit: params.limit ?? 365,
    },
  });
  if (res?.isError) throw res;
  const data = Array.isArray(res?.data) ? res.data : [];
  const totalCount = parseInt(res?.headers?.["x-total-count"], 10) || data.length;
  return { data, totalCount };
}
