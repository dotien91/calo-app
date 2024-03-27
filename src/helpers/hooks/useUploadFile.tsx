import { useTheme } from "@react-navigation/native";
import FileViewComponent from "@screens/post/components/FileView";
import { uploadMultiFile, uploadMultiMedia } from "@services/api/post";
import * as React from "react";
import { Platform, StyleSheet, Text, View, Dimensions } from "react-native";
import { pick, types } from "react-native-document-picker";
import { selectMedia } from "@helpers/file.helper";
import getPath from "@flyerhq/react-native-android-uri-path";
import { showToast } from "@helpers/super.modal.helper";

const { width } = Dimensions.get("screen");
const isIos = Platform.OS === "ios";

interface IExtraParams {
  cbFinaly: () => void;
}

export function useUploadFile(
  initData?: any[],
  selectionLimit = 30,
  extraParam: IExtraParams,
) {
  const [listFile, setListFile] = React.useState<any[]>(initData || []);
  const [isUpLoadingFile, setIsUpLoadingFile] = React.useState(false);
  const [listFileLocal, setListFileLocal] = React.useState<any[]>(
    initData || [],
  );
  const theme = useTheme();
  const { colors } = theme;
  const getFileName = (i: any) => {
    return (
      i.fileName || i.name || (i.uri || "")?.split("/")?.reverse()?.[0] || ""
    );
  };
  const getLinkUri = (i) => {
    if (i.src) return i.src;
    if (isIos) {
      return i.uri?.replace("file://", "");
    }
    return i.uri;
  };

  const onSelectPicture = async () => {
    setIsUpLoadingFile(true);
    selectMedia({
      config: { mediaType: "photo", selectionLimit: selectionLimit || 30 },
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
          uri: getLinkUri(i),
          type: i.type,
        }));
        setListFileLocal((listFileLocal) => [...listFileLocal, ...fileLocal]);
        const res = await uploadMultiMedia(
          listImage.map((i: any) => ({
            name: getFileName(i),
            uri: getLinkUri(i),
            type: i.type,
          })),
        );

        console.log("resresresres", res);
        if (Array.isArray(res)) {
          const data = res.map((i: any, index: number) => ({
            uri: i?.src,
            type: i?.callback?.media_mime_type,
            _id: i?.callback?._id,
          }));
          setListFile((listFile) => [...listFile, ...data]);
        } else {
          setListFileLocal(listFile);
          showToast({ types: "warning", message: res.message });
        }
        setIsUpLoadingFile(false);
      },
      _finally: () => {
        extraParam?.cbFinaly?.();
        setIsUpLoadingFile(false);
      },
      croping: false,
    });
  };

  const renderFile = React.useCallback(() => {
    return (
      <View style={styles.viewImage}>
        {listFileLocal.slice(0, 4).map((item: any, index: number) => {
          if (index < 3) {
            const done = listFile.findIndex((i) => i.uri == item.uri);
            return (
              <FileViewComponent
                style={styles.viewFile}
                item={item}
                key={`listFileLocal - ${index}`}
                onPressClear={() => onRemove(item)}
                isDone={done > -1}
              />
            );
          }
          if (listFileLocal.length >= 4) {
            return (
              <View
                style={[
                  styles.viewFile,
                  {
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: colors.borderColor,
                    borderRadius: 10,
                  },
                ]}
                key={`listFileLocal - ${index}`}
              >
                <Text style={{ color: colors.textInput }}>
                  +{listFileLocal.length - 3}
                </Text>
              </View>
            );
          }
          return;
        })}
      </View>
    );
  }, [listFileLocal, listFile]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRemove = ({ uri, _id }: { uri: string; _id: string }) => {
    setListFileLocal(listFileLocal.filter((i) => i.uri !== uri));
    if (listFile?.length) {
      setListFile(listFile.filter((i) => i._id !== _id));
    }
  };

  const onSelectVideo = async () => {
    setIsUpLoadingFile(true);
    selectMedia({
      config: { mediaType: "video", selectionLimit: 30 },
      callback: async (images: any) => {
        if (!images?.[0]) {
          return;
        }
        const listVideo = images.map((i: any) => ({
          uri: i.uri || "",
          fileName: i.name || "",
          type: i.type || "",
        }));
        const fileLocal = listVideo.map((i: any) => ({
          uri: getLinkUri(i),
          type: i.type,
        }));

        setListFileLocal((listFileLocal) => [...listFileLocal, ...fileLocal]);
        console.log("imagesimagesimages", fileLocal);

        const res = await uploadMultiMedia(
          listVideo.map((i: any) => ({
            name: getFileName(i),
            uri: getLinkUri(i),
            type: i.type,
          })),
        );

        console.log("resssss video", res);
        if (Array.isArray(res)) {
          const data = listVideo.map((i: any, index: number) => ({
            uri: getLinkUri(i),
            type: i.type,
            _id: res[index]?.callback?._id,
          }));

          setListFile((listFile) => [...listFile, ...data]);
        } else {
          setListFileLocal(listFile);
          showToast({ types: "warning", message: res.message });
        }
        setIsUpLoadingFile(false);
      },
      croping: false,
    });
  };

  const onSelectFile = async () => {
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
      setIsUpLoadingFile(true);
      console.log("pickerResultpickerResult", pickerResult);
      if (pickerResult.length > 0) {
        const fileUp = pickerResult.reduce((list: any[], current) => {
          return listFile.find((i) => i.uri === current.uri)
            ? list
            : [...list, current];
        }, []);
        console.log("fileUpfileUp", fileUp);
        const fileLocal = fileUp.map((i) => ({
          uri: isIos ? i.uri?.replace("file://", "") : i.uri,
          type: i.type,
          name: i?.name,
        }));
        setListFileLocal((listFileLocal) => [...listFileLocal, ...fileLocal]);
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
          setListFile((listFile) => [...listFile, ...data]);
        }
        setIsUpLoadingFile(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadRecord = React.useCallback(async (recordPaths: string) => {
    setIsUpLoadingFile(true);

    const recordLocalData = [
      {
        uri: (!isIos ? "file://" : "") + getPath(recordPaths || ""),
        name: Platform.select({
          ios: "sound.m4a",
          android: "sound.mp4",
        }),
        type: "audio/mpeg",
      },
    ];

    setListFileLocal(recordLocalData);

    const res = await uploadMultiFile(recordLocalData);
    setIsUpLoadingFile(false);
    if (Array.isArray(res)) {
      const data = recordLocalData.map((i, index) => ({
        name: getFileName(i),
        uri: res[index]?.src,
        type: i.type,
        _id: res[index].callback?._id,
      }));
      console.log(111111, data);
      setListFile(data);
    }
    setIsUpLoadingFile(false);
  }, []);

  const deleteFile = (_id) => {
    setListFile((old) => old.filter((item) => item._id != _id));
  };

  // React.useEffect(() => {
  //   if (listFile?.length) {
  //     setIsUpLoadingFile(false);
  //   }
  // }, [listFile]);

  return {
    listFile,
    onSelectPicture,
    onSelectVideo,
    onSelectFile,
    renderFile,
    isUpLoadingFile,
    uploadRecord,
    setListFile,
    setListFileLocal,
    listFileLocal,
    deleteFile,
  };
}

const styles = StyleSheet.create({
  viewImage: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 14,
    height: (width - 30 - 30) / 4,
  },
  viewFile: {
    width: (width - 30 - 30) / 4,
    height: (width - 30 - 30) / 4,
  },
});
