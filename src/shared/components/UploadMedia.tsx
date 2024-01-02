import { uploadMultiFile, uploadMultiMedia } from "@services/api/post";
import * as React from "react";
import { pick, types } from "react-native-document-picker";
import { isIos } from "utils/helpers/device-ui";
import { selectMedia } from "utils/helpers/file-helper";

export function UploadFile() {
  const [listFile, setListFile] = React.useState<any[]>([]);
  const [listFileLocal, setListFileLocal] = React.useState<any[]>([]);

  const onPressPicture = async () => {
    selectMedia({
      config: { mediaType: "photo", selectionLimit: 30 },
      callback: async (images: any) => {
        if (!images?.[0]) {
          return;
        }
        const listImage = images.map((i: any) => ({
          uri: i.uri || "",
          fileName: i.name || "",
          type: i.type || "",
        }));
        const fileLocal = listImage.map((i: any) => ({
          uri: isIos ? i.uri?.replace("file://", "") : i.uri,
          type: i.type,
        }));
        setListFileLocal(fileLocal);
        const res = await uploadMultiMedia(
          listImage.map((i: any) => ({
            name:
              i.fileName ||
              i.name ||
              (i.uri || "")?.split("/")?.reverse()?.[0] ||
              "",
            uri: isIos ? i.uri?.replace("file://", "") : i.uri,
            type: i.type,
          })),
        );
        if (Array.isArray(res)) {
          const data = listImage.map((i: any, index: number) => ({
            uri: isIos ? i.uri?.replace("file://", "") : i.uri,
            type: i.type,
            _id: res[index]?.callback?._id,
          }));
          setListFile(data);
        }
      },
      croping: false,
    });
  };
  const onPressVideo = async () => {
    selectMedia({
      config: { mediaType: "video", selectionLimit: 30 },
      callback: async (images: any) => {
        if (!images?.[0]) {
          return;
        }
        const listImage = images.map((i: any) => ({
          uri: i.uri || "",
          fileName: i.name || "",
          type: i.type || "",
        }));
        const flieLocal = listImage.map((i: any) => ({
          uri: isIos ? i.uri?.replace("file://", "") : i.uri,
          type: i.type,
        }));
        setListFileLocal(flieLocal);
        const res = await uploadMultiFile(
          listImage.map((i: any) => ({
            name:
              i.fileName ||
              i.name ||
              (i.uri || "")?.split("/")?.reverse()?.[0] ||
              "",
            uri: isIos ? i.uri?.replace("file://", "") : i.uri,
            type: i.type,
          })),
        );
        if (Array.isArray(res)) {
          const data = listImage.map((i: any, index: number) => ({
            uri: isIos ? i.uri?.replace("file://", "") : i.uri,
            type: i.type,
            _id: res[index]?.callback?._id,
          }));
          console.log("data...", data);
          setListFile(data);
        }
      },
      croping: false,
    });
  };
  const onPressFile = async () => {
    try {
      const pickerResult = await pick({
        presentationStyle: "fullScreen",
        type: [
          types.doc,
          types.docx,
          types.pdf,
          types.plainText,
          types.xls,
          types.xlsx,
          types.ppt,
          types.pptx,
          isIos ? "public.mp3" : "audio/mpeg",
        ],
      });
      if (pickerResult.length > 0) {
        const fileUp = pickerResult.reduce((list: any[], current) => {
          return listFile.find((i) => i.uri === current.uri)
            ? list
            : [...list, current];
        }, []);
        const flieLocal = fileUp.map((i) => ({
          uri: isIos ? i.uri?.replace("file://", "") : i.uri,
          type: i.type,
        }));
        setListFileLocal(flieLocal);
        const res = await uploadMultiFile(
          fileUp.map((i) => ({
            name:
              i.fileName ||
              i.name ||
              (i.uri || "")?.split("/")?.reverse()?.[0] ||
              "",
            uri: isIos ? i.uri?.replace("file://", "") : i.uri,
            type: i.type,
          })),
        );
        if (Array.isArray(res)) {
          const data = fileUp.map((i, index) => ({
            name:
              i.fileName ||
              i.name ||
              (i.uri || "")?.split("/")?.reverse()?.[0] ||
              "",
            uri: isIos ? i.uri?.replace("file://", "") : i.uri,
            type: i.type,
            _id: res[index].callback?._id,
          }));
          console.log("data...", data);
          setListFile(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    listFile,
    listFileLocal,
    onPressPicture,
    onPressVideo,
    onPressFile,
  };
}
