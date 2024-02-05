import { ExtendedTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { HS, MHS, VS } from "./ui/sizes.ui";
import { Device } from "./ui/device.ui";
import { palette } from "@theme/themes";

export default (theme: ExtendedTheme) => {
  return StyleSheet.create<any>({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      alignItems: "center",
      paddingVertical: VS._120,
      justifyContent: "space-between",
    },
    viewActions: {
      flexDirection: "row",
      width: Device.width - 2 * HS._62,
      alignItems: "center",
      justifyContent: "space-between",
    },
    iconMic: {
      width: MHS._54,
      height: MHS._54,
      borderRadius: MHS._54,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.backgroundTextInput,
    },
    iconVolume: {
      width: MHS._54,
      height: MHS._54,
      borderRadius: MHS._54,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.backgroundTextInput,
    },
    iconCall: {
      width: MHS._80,
      height: MHS._80,
      borderRadius: MHS._80,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: palette.error,
    },
    viewMyAccount: {
      width: MHS._50,
      height: MHS._50,
      borderRadius: MHS._50,
      backgroundColor: theme.background,
      position: "absolute",
      zIndex: 100,
      elevation: 100,
      left: HS._10,
      justifyContent: "center",
      alignItems: "center",
      top: 0,
    },
    viewOtherAvatar: {
      width: MHS._50,
      height: MHS._50,
      borderRadius: MHS._50,
      backgroundColor: palette.backgroundMain,
      padding: MHS._20,
      position: "absolute",
      zIndex: 100,
      elevation: 100,
      right: HS._10,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    ringing: {
      borderWidth: 1,
      borderColor: theme.text,
      borderRadius: 10000,
      position: "absolute",
      zIndex: 10,
    },
  });
};
