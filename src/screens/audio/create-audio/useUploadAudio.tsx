import { useState } from "react";
import DocumentPicker from "react-native-document-picker";
import { uploadMultiFile } from "@services/api/post.api";
import { isIos } from "@helpers/device.info.helper";
import { showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";

const useUploadAudio = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const pickAudio = async () => {
    try {
      const pickerResult = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });

      setUploading(true);
      console.log("pickerResultpickerResult", pickerResult);
      if (pickerResult.length > 0) {
        console.log("fileUpfileUp", pickerResult);
        const res = await uploadMultiFile(
          pickerResult.map((i) => ({
            name:
              i.fileName ||
              i.name ||
              (i.uri || "")?.split("/")?.reverse()?.[0] ||
              "",
            uri: isIos() ? i.uri?.replace("file://", "") : i.uri,
            type: i.type || "",
          })),
        );
        if (Array.isArray(res)) {
          const data = pickerResult.map((i, index) => ({
            name:
              i.fileName ||
              i.name ||
              (i.uri || "")?.split("/")?.reverse()?.[0] ||
              "",
            uri: isIos() ? i.uri?.replace("file://", "") : i.uri,
            type: i.type,
            _id: res[index].callback?._id,
          }));
          console.log("data...", data);
          setFile(data[0]);
        } else {
          showToast({
            type: "error",
            message: translations.post.uploadFileFaild,
          });
        }
        setUploading(false);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // Người dùng đã huỷ lựa chọn file
      } else {
        setError(err);
      }
    }
  };

  return {
    file,
    pickAudio,
    uploading,
    error,
  };
};

export default useUploadAudio;
