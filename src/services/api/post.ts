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

export async function uploadMedia(file: MediaAsset) {
  console.log("ress...uploadMedia");
  const newForm = new FormData();
  newForm.append("file[]", file);
  return request({
    method: METHOD.POST,
    urlPath: `${UPLOAD_URL}upload-media?callback=${BASEURL}/api/media/create`,
    data: newForm,
  }).then((response) => {
    console.log("ress...", response);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  });
}

export async function uploadFile(file: MediaAsset) {
  console.log("ress...uploadFile");

  const newForm = new FormData();
  newForm.append("file[]", file);
  return request({
    method: METHOD.POST,
    urlPath: `${UPLOAD_URL}/upload-file?callback=${BASEURL}/api/chat-media/create`,
    data: newForm,
  }).then((response) => {
    console.log("ress...", response);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  });
}

// export async function uploadFile(file: MediaAsset): Promise<MediaResponse[]> {
//   try {
//     const newForm = new FormData();
//     newForm.append("file[]", file);
//     const mediaResponse = await axios.post(APP_URL.APP_UPLOAD_FILE, newForm, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     if (Array.isArray(mediaResponse.data)) {
//       return mediaResponse.data;
//     }
//     return [];
//   } catch (error) {
//     console.log(error, "syncMessages");
//     throw error;
//   }
// }
