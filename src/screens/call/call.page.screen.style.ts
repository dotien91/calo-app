import { ExtendedTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { HS, MHS, VS } from "./ui/sizes.ui";
import { Device } from "./ui/device.ui";
import { palette } from "@theme/themes";
export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<any>({
    container: {
      padding: 0,
      marginTop: 0,
      // backgroundColor: "red",
      borderWidth: 0,
      borderRadius: 0,
      width: Device.width,
      height: Device.heightScreen,
      borderColor: colors.borderColor,
      backgroundColor: palette.text,
    },
    descriptionTextStyle: {
      marginTop: 8,
    },
    contentContainer: {
      marginTop: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    languageContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    languageColorStyle: {
      width: 15,
      height: 15,
      borderWidth: 1,
      borderRadius: 15,
      borderColor: colors.borderColor,
      backgroundColor: colors.calpyse,
    },
    starContainer: {
      marginLeft: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    valueTextStyle: {
      marginLeft: 8,
    },
    forkContainer: {
      marginLeft: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    localVideo: {
      width: "100%",
      height: "100%",
    },
    topHeaderCall: {
      width: Device.width,
      height: 140,
      flex: 1,
      zIndex: 11,
      position: "absolute",
    },
    topFooterCall: {
      width: Device.width,
      height: 110,
      flex: 1,
      bottom: 0,
      zIndex: 11,
      position: "absolute",
    },
    topHeaderTimer: {
      zIndex: 12,
      width: Device.width,
      marginTop: Device.heightPaddingStatusBar + VS._20,
      position: "absolute",
      alignContent: "center",
      alignItems: "center",
      textAlign: "center",
    },
    safeAreaView: {
      flex: 1,
      zIndex: 100000,
      position: "relative",
      alignContent: "flex-end",
      alignItems: "flex-end",
    },
    viewLocalVideo: {
      overflow: "hidden",
      zIndex: 10,
      elevation: 10,
      backgroundColor: "black",
    },
    viewActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: HS._32,
      paddingTop: VS._18,
      paddingBottom: 0,
    },
    viewIcon: {
      width: MHS._40,
      height: MHS._40,
      borderRadius: MHS._40,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.backgroundTextInput,
    },
    iconCall: {
      width: MHS._40,
      height: MHS._40,
      borderRadius: MHS._40,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: `${theme.textError}90`,
    },
    viewActionOptions: {
      // position: "absolute",
      // bottom: 0,
    },
    options: {
      backgroundColor: theme.backgroundTextInput,
      borderTopLeftRadius: MHS._20,
      borderTopRightRadius: MHS._20,
      overflow: "hidden",
      bottom: 40,
      position: "absolute",
      width: Device.width,
      right: 0,
      left: 0,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: HS._16,
      paddingHorizontal: HS._32,
    },
    avatar: {
      position: "absolute",
      zIndex: 1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    remoteVideo: {
      width: "100%",
      height: "100%",
    },
    line: {
      position: "absolute",
      width: 3,
      height: "70%",
      borderRadius: 3,
      backgroundColor: palette.background,
      transform: [
        {
          rotate: "-30deg",
        },
      ],
    },
    iconRemote: {
      position: "absolute",
      zIndex: 1000,
      bottom: VS._100,
      backgroundColor: "transparent",
      right: HS._16,
    },
    viewCallEnd: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },
    headerIcon: {
      position: "absolute",
      left: 8,
      top: Device.heightPaddingStatusBar + VS._12,
      zIndex: 100,
      padding: MHS._10,
      borderRadius: 100,
    },
  });
};
