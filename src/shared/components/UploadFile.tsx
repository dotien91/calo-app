import { useTheme } from "@react-navigation/native";
import FileViewComponent from "@screens/post/components/FileView";
import { uploadMultiFile, uploadMultiMedia } from "@services/api/post";
import * as React from "react";
import { Platform, StyleSheet, Text, View, Dimensions } from "react-native";
import { pick, types } from "react-native-document-picker";
import { selectMedia } from "utils/helpers/file-helper";
const { width } = Dimensions.get("screen");
const isIos = Platform.OS === "ios";

export function UploadFile() {
  const [listFile, setListFile] = React.useState<any[]>([]);
  const [listFileLocal, setListFileLocal] = React.useState<any[]>([]);
  const theme = useTheme();
  const { colors } = theme;
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
        setListFileLocal((listFileLocal) => [...listFileLocal, ...fileLocal]);
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
          setListFile((listFile) => [...listFile, ...data]);
        }
      },
      croping: false,
    });
  };

  const renderFile = React.useCallback(() => {
    return (
      <View style={styles.viewImage}>
        {listFileLocal.slice(0, 4).map((item: any, index: number) => {
          if (index < 3)
            return (
              <FileViewComponent
                style={styles.viewFile}
                item={item}
                key={`listFileLocal - ${index}`}
                onPressClear={() => onRemove(item.uri)}
              />
            );
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
  }, [listFileLocal]); // eslint-disable-line react-hooks/exhaustive-deps
  const onRemove = (uri: string) => {
    setListFileLocal(listFileLocal.filter((i) => i.uri !== uri));
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
        const fileLocal = listImage.map((i: any) => ({
          uri: isIos ? i.uri?.replace("file://", "") : i.uri,
          type: i.type,
        }));
        setListFileLocal((listFileLocal) => [...listFileLocal, ...fileLocal]);
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
          setListFile((listFile) => [...listFile, ...data]);
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
        const fileLocal = fileUp.map((i) => ({
          uri: isIos ? i.uri?.replace("file://", "") : i.uri,
          type: i.type,
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    listFile,
    onPressPicture,
    onPressVideo,
    onPressFile,
    renderFile,
  };
}

const styles = StyleSheet.create({
  viewImage: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  viewFile: {
    width: (width - 32 - 30) / 4,
    height: (width - 32 - 30) / 4,
  },
});
