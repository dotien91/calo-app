import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "@react-navigation/native";

export const HIT_SLOP_EXPAND_10 = { top: 10, left: 10, right: 10, bottom: 10 };

import IconFileComponent from "./IconFileComponent";
import CommonStyle from "@theme/styles";
import IconSvg from "assets/svg";
import { isIos, formatBytes } from "@utils/device.ui.utils";
import { uploadFile, uploadMedia } from "@services/api/post";
import { palette } from "@theme/themes";

interface Props {
  item: any;
  onPressClear: () => void;
  onUpload?: () => void;
  style: ViewStyle;
  sizeIcon?: number;
}

const FileViewComponent = ({
  item,
  onPressClear,
  onUpload,
  style,
  sizeIcon = 32,
}: Props) => {
  const theme = useTheme();
  const { colors } = theme;

  const [error, setError] = useState(false);
  const [done, setDone] = useState(onUpload ? false : true);

  const uploadLinkFile = async () => {
    try {
      const res = await uploadFile({
        name:
          item.fileName ||
          item.name ||
          (item.uri || "")?.split("/")?.reverse()?.[0] ||
          "",
        uri: isIos ? item.uri?.replace("file://", "") : item.uri,
        type: item.type,
      });
      if (res?.[0]?.callback?._id) {
        setDone(true);

        onUpload?.(res?.[0]);
      }
    } catch (error: any) {
      console.log("error", error);

      setError(true);
      // thông báo
      // GlobalPopupHelper.alert({
      //   type: "error",
      //   message: error?.message || languages.somethingWentWrong,
      // });
    }
  };

  const uploadLinkMedia = async () => {
    try {
      const res = await uploadMedia({
        name:
          item.fileName ||
          item.name ||
          (item.uri || "")?.split("/")?.reverse()?.[0] ||
          "",
        uri: isIos ? item.uri?.replace("file://", "") : item.uri,
        type: item.type,
      });

      console.log("...", res);
      if (res?.[0]?.callback?._id) {
        setDone(true);

        onUpload?.(res?.[0]);
      }
    } catch (error: any) {
      console.log("error", error);

      setError(true);
      // Thông báo lỗi
      // GlobalPopupHelper.alert({
      //   type: "error",
      //   message: error?.message || languages.somethingWentWrong,
      // });
    }
  };

  useEffect(() => {
    if (onUpload) {
      if (item.is_file) {
        uploadLinkFile();
      } else {
        uploadLinkMedia();
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <View style={[styles.viewFile, style]}>
      <IconFileComponent file={item} sizeIcon={sizeIcon} />
      <View style={styles.content}>
        <Text
          style={[
            CommonStyle.hnSemiBold,
            { fontSize: 12, color: colors.mainColor2 },
          ]}
        >
          {item.name || item.fileName}
        </Text>

        {(item.size || item.fileSize) && (
          <Text style={{ fontSize: 10, color: colors.placeholder }}>
            {formatBytes(item.size || item.fileSize || 0)}
          </Text>
        )}
      </View>
      {!done && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={colors.mainColor2} />
        </View>
      )}
      {error && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconSvg name="icWarning" size={40} color={colors.primary} />
        </View>
      )}
      <Pressable
        style={styles.iconClose}
        hitSlop={HIT_SLOP_EXPAND_10}
        onPress={() => onPressClear()}
      >
        <IconSvg name="icClose" size={12} color={colors.white} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  viewFile: {},
  content: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 0,
    overflow: "hidden",
    borderRadius: 99,
  },
  iconClose: {
    backgroundColor: palette.backgroundClose,
    width: 24,
    height: 24,
    borderRadius: 24,
    ...CommonStyle.flexCenter,
    top: -10,
    right: -10,
    position: "absolute",
  },
});

export default FileViewComponent;
