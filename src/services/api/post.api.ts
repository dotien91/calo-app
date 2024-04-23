import { Asset } from "react-native-image-picker";
import request, { METHOD, BASEURL, UPLOAD_URL } from "./api";
import { TypedCropImage } from "shared/models";

interface MediaAsset extends TypedCropImage, Asset {
  duration?: any;
  path?: string;
  name?: string;
}

// interface MediaResponse {
//   src: string;
//   callback: TypedMedia;
// }

export async function uploadMedia(file: MediaAsset, onUploadProgress?: any) {
  const newForm = new FormData();
  newForm.append("file[]", file);
  return request({
    method: METHOD.POST,
    url: `${UPLOAD_URL}upload-media?callback=${BASEURL}media/create`,
    data: newForm,
    customHeader: { "Content-Type": "multipart/form-data" },
    onUploadProgress: onUploadProgress ? onUploadProgress : () => {},
  }).then((response) => {
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  });
}

export async function uploadFile(file: MediaAsset) {
  const newForm = new FormData();
  newForm.append("file[]", file);
  return request({
    method: METHOD.POST,
    url: `${UPLOAD_URL}upload-file?callback=${BASEURL}media/create`,
    data: newForm,
    customHeader: { "Content-Type": "multipart/form-data" },
  }).then((response) => {
    return response;
  });
}

export async function getCategory() {
  return request({
    method: METHOD.GET,
    urlPath: "community/list-category",
  }).then((response) => {
    return response;
  });
}

export async function uploadMultiFile(files: MediaAsset[]): Promise<any> {
  const newForm = new FormData();
  files.forEach((element) => {
    newForm.append("file[]", element);
  });
  return request({
    method: METHOD.POST,
    url: `${UPLOAD_URL}upload-file?callback=${BASEURL}media/create`,
    data: newForm,
    customHeader: { "Content-Type": "multipart/form-data" },
  }).then((response) => {
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response;
  });
}

export async function uploadMultiMedia(files: MediaAsset[]): Promise<any> {
  const newForm = new FormData();
  files.forEach((element) => {
    newForm.append("file[]", element);
  });
  return request({
    method: METHOD.POST,
    url: `${UPLOAD_URL}upload-media?callback=${BASEURL}media/create`,
    data: newForm,
    customHeader: { "Content-Type": "multipart/form-data" },
  }).then((response) => {
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response;
  });
}

export async function createNewPost(data: any): Promise<any> {
  return request({
    method: METHOD.POST,
    urlPath: "community/create",
    data: data,
  }).then((response) => {
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response;
  });
}

export async function getListPost(params) {
  return request({
    method: METHOD.GET,
    urlPath: "Community/list",
    params,
  }).then((response) => {
    return response;
  });
}

export async function getPostDetail(id: string, params) {
  return request({
    method: METHOD.GET,
    urlPath: `Community/detail/${id}`,
    params,
  }).then((response) => {
    return response;
  });
}
export async function getListComment(params) {
  return request({
    method: METHOD.GET,
    urlPath: "Community/list-comment",
    params,
  }).then((response) => {
    return response;
  });
}

export async function postComment(data: any) {
  return request({
    method: METHOD.POST,
    urlPath: "community/create-comment",
    data: data,
  }).then((response) => {
    return response;
  });
}

export async function postLike(data: any) {
  return request({
    method: METHOD.POST,
    urlPath: "community/create-like",
    data: data,
  }).then((response) => {
    return response;
  });
}
export async function postLikeCommnent(data: any) {
  return request({
    method: METHOD.POST,
    urlPath: "community/create-like-comment",
    data: data,
  }).then((response) => {
    return response;
  });
}

export async function deletePost(id: string) {
  return request({
    method: METHOD.DELETE,
    urlPath: `community/delete/${id}`,
  }).then((response) => {
    return response;
  });
}

export async function deleteComment(id: string) {
  return request({
    method: METHOD.DELETE,
    urlPath: `community/delete-comment/${id}`,
  }).then((response) => {
    return response;
  });
}

export async function followUser(data: any) {
  return request({
    method: METHOD.POST,
    urlPath: "user/follow",
    data: data,
  }).then((response) => {
    return response;
  });
}

export async function unFollowUser(data: any) {
  return request({
    method: METHOD.POST,
    urlPath: "user/un-follow",
    data: data,
  }).then((response) => {
    return response;
  });
}
export async function blockUser(data: any) {
  return request({
    method: METHOD.POST,
    urlPath: "user/block",
    data: data,
  }).then((response) => {
    return response;
  });
}
export async function updatePost(data: any) {
  return request({
    method: METHOD.PATCH,
    urlPath: "community/update",
    data: data,
  }).then((response) => {
    return response;
  });
}
export async function updateCommentWithId(data: any) {
  return request({
    method: METHOD.PATCH,
    urlPath: "community/update-comment",
    data: data,
  }).then((response) => {
    return response;
  });
}

export async function createReport(data: {
  report_type: string;
  partner_id: string;
  report_content: string;
}) {
  return request({
    method: METHOD.POST,
    urlPath: "report/create-report",
    data: data,
  }).then((response) => {
    return response;
  });
}

export async function postShare(data: any) {
  return request({
    method: METHOD.POST,
    urlPath: "community/share",
    data: data,
  }).then((response) => {
    return response;
  });
}
