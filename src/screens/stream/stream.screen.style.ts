import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";
import { Device } from "utils/device.utils";

interface Style {
  container: ViewStyle;
  chatView: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: "grey",
    },
    chatView: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 40,
      height: 250,
      zIndex: 1,
      justifyContent: "flex-end",
    },
    publisher_camera: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    footer_container: {
      position: "absolute",
      bottom: 20,
      left: 0,
      right: 0,
      justifyContent: "space-between",
      padding: 10,
      flexDirection: "row",
    },
    mute_container: {
      flex: 1,
      alignItems: "flex-start",
    },
    stream_container: {
      flex: 1,
      alignItems: "center",
    },
    controller_container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    topView: {
      position: "absolite",
      left: 30,
      width: Device.width - 60,
      top: 100,
      height: 40,
      zIndex: 1,
      // paddingVertical: 8,
      // paddingHorizontal: 8,
      backgroundColor: colors.lightOverlay,
      borderRadius: 99,
    },
    input: {
      // backgroundColor: colors.white,
      maxHeight: 40,
      color: colors.white,
    },
  });
};
