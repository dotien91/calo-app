import { uploadMedia } from "@services/api/post.api";
import * as React from "react";
import { Platform } from "react-native";
import { selectMedia } from "@helpers/file.helper";
import { showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";

const isIos = Platform.OS === "ios";

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function useUploadFile(selectionLimit = 1) {
  const [image, setImage] = React.useState<any | null>(null);
  const [status, setStatus] = React.useState<UploadStatus>('idle');

  const getFileName = (i: any) => {
    return i.fileName || i.name || (i.uri || "")?.split("/")?.reverse()?.[0] || "";
  };

  const getLinkUri = (i: any) => {
    if (i.src) return i.src;
    if (isIos) {
      return i.uri?.replace("file://", "");
    }
    return i.uri;
  };

  const onSelectPicture = async () => {
    selectMedia({
      config: { 
        mediaType: "photo", 
        selectionLimit: 1 
      },
      callback: async (images: any) => {
        if (!images?.[0]) return;
        
        const imageObj = images[0];
        
        const fileData = {
          uri: imageObj.uri || "",
          fileName: imageObj.name || "",
          type: imageObj.type || "",
        };

        // Ảnh local (Preview tạm)
        const localImage = {
          uri: getLinkUri(fileData),
          type: fileData.type,
          name: getFileName(fileData),
          isLocal: true 
        };
        
        setImage(localImage);
        setStatus('uploading');

        try {
            const res = await uploadMedia({
                name: localImage.name,
                uri: localImage.uri,
                type: localImage.type,
            });

            console.log("Server Response:", res); // Debug log

            // --- SỬA LOGIC MAP RESPONSE TẠI ĐÂY ---
            // Kiểm tra nếu có _id là thành công
            if (!res.isError) {
              const data = res.data
              const remoteImage = {
                // Ưu tiên lấy link gốc (original) để AI đọc rõ nhất
                uri: data.media_url || data.urls?.original || data.media_thumbnail, 
                type: data.media_mime_type, // "image/jpeg"
                _id: data._id,              // "6971..."
                isLocal: false             // Đánh dấu đã lên server
              };
              
              console.log("Mapped Image:", remoteImage); // Debug log kết quả map
              
              setImage(remoteImage);
              setStatus('success');
            } else {
              // Trường hợp server trả về lỗi hoặc không có _id
              console.log("Upload failed response:", res);
              setStatus('error');
              showToast({
                type: "error",
                message: translations.post.uploadImageFaild,
              });
            }
            // --------------------------------------

        } catch (error) {
            console.error("Upload Error:", error);
            setStatus('error');
            showToast({ type: "error", message: "Error uploading image" });
        }
      },
      croping: false,
      _finally: () => {
        // Required by selectMedia
      }
    });
  };

  const clearImage = () => {
    setImage(null);
    setStatus('idle');
  };

  return {
    image,
    setImage,
    status,
    onSelectPicture,
    clearImage,
  };
}