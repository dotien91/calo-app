import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, StyleSheet } from "react-native";
import { Device } from "@utils/device.utils";
import CS from "@theme/styles";
import { ScreenHeight } from "@freakycoder/react-native-helpers";

interface Style {
  container: ViewStyle;
  chatView: ViewStyle;
  topView: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.black,
    },
    chatView: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 10,
      zIndex: 1,
      maxHeight: ScreenHeight / 3,
    },
    publisher_camera: {
      flex: 1,
      width: "100%",
      height: ScreenHeight,
      position: "absolute",
    },
    footer_container: {
      position: "absolute",
      bottom: 144,
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
      ...CS.flexCenter,
    },
    controller_container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    topView: {
      position: "absolite",
      left: 30,
      width: Device.width - 64,
      top: 140,
      height: 72,
      zIndex: 1,
      // paddingVertical: 8,
      // paddingHorizontal: 8,
      // backgroundColor: colors.lightOverlay,
      flexDirection: "row",
      gap: 8,
    },
    input: {
      backgroundColor: colors.backgroundInputLive,
      height: 72,
      gap: 8,
      color: colors.white,
      borderRadius: 4,
      textAlignVertical: "top",
      paddingTop: 12,
    },
    listChat: {
      backgroundColor: "red",
    },
    viewAvatarLive: {
      width: 72,
      height: 72,
      borderRadius: 4,
      ...CS.center,
    },
    avatarLive: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 24,
      ...CS.center,
      backgroundColor: colors.grey5,
      borderRadius: 4,
      zIndex: 2,
    },
    viewInput: {
      ...CS.flex1,
      backgroundColor: colors.backgroundInputLive,
      borderRadius: 4,
    },
    shadowView: {
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 0,
      elevation: 5,
    },
    shadowIcon: {
      position: "absolute",
      top: 68,
      zIndex: 1,
      borderRadius: 20,
      backgroundColor: colors.backgroundInputLive,
    },
  });
};
