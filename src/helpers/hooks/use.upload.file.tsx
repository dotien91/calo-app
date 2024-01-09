// import { useTheme } from "@react-navigation/native";
import { pick, types } from "react-native-document-picker";
import * as React from "react";
// import { Platform, StyleSheet, Dimensions } from "react-native";
import { Platform } from "react-native";

// import FileViewComponent from "@screens/post/components/FileView";
import { uploadMultiFile, uploadMultiMedia } from "@services/api/post";
import { selectMedia } from "@helpers/file.helper";
import getPath from "@flyerhq/react-native-android-uri-path";

// const { width } = Dimensions.get("screen");
const isIos = Platform.OS === "ios";

export const useUploadFile = () => {
  const [listFile, setListFile] = React.useState<any[]>([]);
  const [listFileLocal, setListFileLocal] = React.useState<any[]>([]);
  // const theme = useTheme();
  // const { colors } = theme;

  const getPathMedia = (i: any) => {
    return isIos ? i.uri?.replace("file://", "") : i.uri;
  };

  const getFileName = (i: any) => {
    return (
      i.fileName || i.name || (i.uri || "")?.split("/")?.reverse()?.[0] || ""
    );
  };

  const onSelectPicture = async () => {
    selectMedia({
      config: { mediaType: "photo", selectionLimit: 30 },
      callback: async (images: any) => {
        if (!images?.[0]) {
          return;
        }
        const listImage = images.map((i: any) => ({
          uri: i.uri || "",
          fileName: i.name || "",
          type: "image",
        }));
        const fileLocal = listImage.map((i: any) => ({
          uri: getPathMedia(i),
          type: "image",
        }));
        console.log("fileLocalfileLocal", listFileLocal);
        setListFileLocal((listFileLocal) => [...listFileLocal, ...fileLocal]);
        const res = await uploadMultiMedia(
          listImage.map((i: any) => ({
            name: getFileName(i),
            uri: getPathMedia(i),
            type: "image",
          })),
        );

        console.log("Ressssss", res);
        if (Array.isArray(res)) {
          const data = listImage.map((i: any, index: number) => ({
            uri: getPathMedia(i),
            type: "image",
            _id: res[index]?.callback?._id,
          }));
          setListFile((listFile) => [...listFile, ...data]);
        }
      },
      croping: false,
    });
  };

  // const renderFile = React.useCallback(() => {
  //   return (
  //     <View style={styles.viewImage}>
  //       {listFileLocal.slice(0, 4).map((item: any, index: number) => {
  //         if (index < 3)
  //           return (
  //             <FileViewComponent
  //               style={styles.viewFile}
  //               item={item}
  //               key={`listFileLocal - ${index}`}
  //               onPressClear={() => onRemove(item.uri)}
  //             />
  //           );
  //         if (listFileLocal.length >= 4) {
  //           return (
  //             <View
  //               style={[
  //                 styles.viewFile,
  //                 {
  //                   justifyContent: "center",
  //                   alignItems: "center",
  //                   borderWidth: 1,
  //                   borderColor: colors.borderColor,
  //                   borderRadius: 10,
  //                 },
  //               ]}
  //               key={`listFileLocal - ${index}`}
  //             >
  //               <Text style={{ color: colors.textInput }}>
  //                 +{listFileLocal.length - 3}
  //               </Text>
  //             </View>
  //           );
  //         }
  //         return;
  //       })}
  //     </View>
  //   );
  // }, [listFileLocal]); // eslint-disable-line react-hooks/exhaustive-deps

  // const onRemove = (uri: string) => {
  //   setListFileLocal(listFileLocal.filter((i) => i.uri !== uri));
  // };

  const onSelectVideo = async () => {
    selectMedia({
      config: { mediaType: "video", selectionLimit: 30 },
      callback: async (images: any) => {
        if (!images?.[0]) {
          return;
        }
        const listImage = images.map((i: any) => ({
          uri: i.uri || "",
          fileName: i.name || "",
          type: "video",
        }));
        const fileLocal = listImage.map((i: any) => ({
          uri: getPathMedia(i),
          type: i.type,
        }));
        setListFileLocal((listFileLocal) => [...listFileLocal, ...fileLocal]);
        const res = await uploadMultiFile(
          listImage.map((i: any) => ({
            name: getFileName(i),
            uri: getPathMedia(i),
            type: "video",
          })),
        );
        if (Array.isArray(res)) {
          const data = listImage.map((i: any, index: number) => ({
            uri: getPathMedia(i),
            type: "video",

            _id: res[index]?.callback?._id,
          }));
          setListFile((listFile) => [...listFile, ...data]);
        }
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
      if (pickerResult.length > 0) {
        const fileUp = pickerResult.reduce((list: any[], current) => {
          return listFile.find((i) => i.uri === current.uri)
            ? list
            : [...list, current];
        }, []);
        const fileLocal = fileUp.map((i) => ({
          uri: getPathMedia(i),
          type: i.type,
        }));
        setListFileLocal((listFileLocal) => [...listFileLocal, ...fileLocal]);
        const res = await uploadMultiFile(
          fileUp.map((i) => ({
            name: getFileName(i),
            uri: getPathMedia(i),
            type: i.type,
          })),
        );
        if (Array.isArray(res)) {
          const data = fileUp.map((i, index) => ({
            name: getFileName(i),
            uri: getPathMedia(i),
            type: i.type,
            _id: res[index].callback?._id,
          }));
          setListFile((listFile) => [...listFile, ...data]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadRecord = async (recordPaths: string) => {
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
    if (Array.isArray(res)) {
      const data = recordLocalData.map((i, index) => ({
        name: getFileName(i),
        uri: getPathMedia(i),
        type: i.type,
        _id: res[index].callback?._id,
      }));
      setListFile(data);
    }
  };

  return {
    listFile,
    onSelectPicture,
    onSelectVideo,
    onSelectFile,
    // renderFile,
    uploadRecord,
    setListFile,
    listFileLocal,
    setListFileLocal,
  };
};

// const styles = StyleSheet.create({
//   viewImage: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 10,
//     paddingHorizontal: 14,
//     marginTop: 10,
//   },
//   viewFile: {
//     width: (width - 32 - 30) / 4,
//     height: (width - 32 - 30) / 4,
//   },
// });
